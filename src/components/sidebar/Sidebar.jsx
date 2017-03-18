import React from 'react';
import './Sidebar.styl';
import NavBar from './navBar/NavBar.jsx';
import FilterPane from './analysisPane/FilterPane.jsx';
import VisualizationPane from './analysisPane/VisualizationPane.jsx';
import HomePane from './homePane/HomePane.jsx';
import DownloadsPane from './downloadsPane/DownloadsPane.jsx';
import { memory1 } from './memories/memory1.jsx';

var memory = {
  filters: {
    filterSettings: {},
    lastFilterEventData: null
  },
  visualizers: {
    activeVis: 'classes',
    classes:{

    },
    passFail: {

    }
  }
}

class Sidebar extends React.Component {
  constructor(props){
    super();
    memory = memory1;
    this.state = {
      activePane: 'home',
      counts: {
        filter: undefined
      }
    }
    this.handleNavBarClick = this.handleNavBarClick.bind(this);
    this.handleCountUpdate = this.handleCountUpdate.bind(this);
  }

  updateMasterMemory(componentName, componentMemory){
    memory[componentName] = componentMemory;
    console.log(memory);
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
        return <VisualizationPane propsMd={this.props.propsMd} transitionDuration={transitionDuration}/>;
      case 'downloads':
        return <DownloadsPane transitionDuration={transitionDuration} />;
      default:
        return <HomePane />;
    }
  }
}
 export default Sidebar;