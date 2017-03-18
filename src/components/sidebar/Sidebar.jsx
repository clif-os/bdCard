import React from 'react';
import './Sidebar.styl';
import NavBar from './navBar/NavBar.jsx';
import FilterPane from './analysisPane/FilterPane.jsx';
import VisualizationPane from './analysisPane/VisualizationPane.jsx';
import HomePane from './homePane/HomePane.jsx';
import DownloadsPane from './downloadsPane/DownloadsPane.jsx';
import MapsPane from './mapsPane/MapsPane.jsx';

import { homesMap, educationMap, incomeMap, raceMap } from './mapMemories/memories.jsx';
const mapMemories = [homesMap, educationMap, incomeMap, raceMap];

var memory = {
  filters: {
    filterSettings: {},
    lastFilterEventData: null
  },
  visualizers: {
    visualizerChoice: 'classes',
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
  }

  handleMapMemoryChoice(memoryChoice){
    memory = memoryChoice;
    const filterEvent = memory.filters.lastFilterEventData;
    const visEvent = memory.visualizers[memory.visualizers.visualizerChoice].lastVisEventData;
    const visFiltEvent = {
      filterEvent: filterEvent,
      visEvent: visEvent
    }
    if (memory.visualizers.visualizerChoice === 'classes'){
      const loadMap = new CustomEvent('VISFILT_CLASSES', {'detail': visFiltEvent})
      document.dispatchEvent(loadMap);
    } else if (memory.visualizers.visualizerChoice === 'passFail'){
      const loadMap = new CustomEvent('VISFILT_PASSFAIL', {'detail': visFiltEvent})
      document.dispatchEvent(loadMap);
    }
    const deselect = new CustomEvent('DESELECT_FEATURE');
    document.dispatchEvent(deselect);
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
        return <MapsPane transitionDuration={transitionDuration} handleMapMemoryChoice={this.handleMapMemoryChoice} mapMemories={mapMemories}/>
      default:
        return <HomePane />;
    }
  }
}
 export default Sidebar;