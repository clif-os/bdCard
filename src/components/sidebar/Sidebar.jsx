import React from 'react';
import './Sidebar.styl';
import NavBar from './navBar/NavBar.jsx';
import FilterPane from './analysisPane/FilterPane.jsx';
import VisualizationPane from './analysisPane/VisualizationPane.jsx';
import HomePane from './homePane/HomePane.jsx';
import DownloadsPane from './downloadsPane/DownloadsPane.jsx';
import MapsPane from './mapsPane/MapsPane.jsx';

import { updateActiveFields } from './analysisPane/analysisUtils.jsx';

import { homesMap, educationMap, incomeMap, raceMap } from './mapMemories/memories.jsx';
const mapMemories = [homesMap, educationMap, incomeMap, raceMap];

var memory = {
  filters: {
    filterSettings: {},
    lastFilterEventData: null
  },
  visualizers: {
    visualizerChoice: 'classes',
    unvisualized: '',
    classes:{
      visSetting: {},
      lastVisEventData: null,
      firstDraw: true
    },
    passFail: {
      filterSettings: {},
      lastVisEventData: null,
      unvisualized: false
    }
  }
}

var savedMapMemories = []

class Sidebar extends React.Component {
  constructor(props){
    super();
    this.state = {
      activePane: 'home',
      counts: {
        filter: undefined
      }
    }
    this.handleNavBarClick = this.handleNavBarClick.bind(this);
    this.handleCountUpdate = this.handleCountUpdate.bind(this);
    this.handleMapMemoryChoice = this.handleMapMemoryChoice.bind(this);
  }

  buildPropLabel(setting){
    if (Object.keys(setting).length === 0){
      return null;
    }
    const fieldLabel = setting.fieldLabel;
    const yearLabel = setting.yearLabel;
    return fieldLabel + ' ' + yearLabel;
  };

  handleMapMemoryChoice(memoryChoice){
    memory = JSON.parse(JSON.stringify(memoryChoice));
    const filterEvent = memory.filters.lastFilterEventData;
    const visEvent = memory.visualizers[memory.visualizers.visualizerChoice].lastVisEventData;
    const visFiltEvent = {
      filterEvent: filterEvent === null ? [] : filterEvent,
      visEvent: visEvent === null ? [] : visEvent
    };
    let eventType;
    if (memory.visualizers.visualizerChoice === 'classes'){
      eventType = 'VISFILT_CLASSES';
      updateActiveFields('classes', memory.visualizers.classes.visSetting)
    } else if (memory.visualizers.visualizerChoice === 'passFail'){
      eventType = 'VISFILT_PASSFAIL';
      updateActiveFields('passFail', memory.visualizers.passFail.filterSettings)
    }
    const loadMap = new CustomEvent(eventType, {'detail': visFiltEvent})
    document.dispatchEvent(loadMap);
    const deselect = new CustomEvent('DESELECT_FEATURE');
    document.dispatchEvent(deselect);
    updateActiveFields('filter', memory.filters.filterSettings);
    let count = 0;
    Object.keys(memory.filters.filterSettings).forEach(filterKey => {
      if (memory.filters.filterSettings[filterKey].filterActive){
        count++;
      }
    });
    this.handleCountUpdate('filter', count);
  }

  setSavedMemories(newMapMemories){
    savedMapMemories = newMapMemories;
  }

  updateMasterMemory(componentName, componentMemory){
    memory[componentName] = componentMemory;
  }

  handleNavBarClick(paneId){
    this.setState({
      activePane: paneId
    });
  }

  handleCountUpdate(componentName, count){
    var newCounts = Object.assign({}, this.state.counts);
    newCounts[componentName] = count;
    this.setState({
      counts: newCounts 
    });
  }

  render() {
    return (
      <div className="sidebar">
        <NavBar handleClick={this.handleNavBarClick} counts={this.state.counts} />
        {this.renderActivePane()}
      </div>
    );
  }

  renderActivePane(){
    const transitionDuration = 250
    switch(this.state.activePane){
      case'home':
        return <HomePane />;
      case 'filter':
        return <FilterPane propsMd={this.props.propsMd} transitionDuration={transitionDuration} handleCountUpdate={this.handleCountUpdate} updateMasterMemory={this.updateMasterMemory} memory={memory.filters} />;
      case 'visualize':
        return <VisualizationPane propsMd={this.props.propsMd} transitionDuration={transitionDuration} updateMasterMemory={this.updateMasterMemory} memory={memory.visualizers} />;
      case 'downloads':
        return <DownloadsPane transitionDuration={transitionDuration} memory={memory} />;
      case 'maps':
        return <MapsPane transitionDuration={transitionDuration} handleMapMemoryChoice={this.handleMapMemoryChoice} memory={memory} mapMemories={mapMemories}  savedMapMemories={savedMapMemories} setSavedMemories={this.setSavedMemories}/>
      default:
        return <HomePane />;
    }
  }
}
 export default Sidebar;