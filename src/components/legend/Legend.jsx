import React from 'react';
import './Legend.styl';
import LegendEntry from './LegendEntry.jsx';
var debounce = require('lodash.debounce');

var memory = null

class Legend extends React.Component {
  constructor(props){
    super();
    memory === null 
      ? this.state = {
          title: props.legendData.description,
          nodesData: props.legendData.nodes
        }
      : this.state = memory;
    document.addEventListener('UPDATE_LEGEND', this.updateLegend.bind(this));
  }

  updateLegend(e){
    const newState = {
      title: e.detail.description,
      nodesData: e.detail.nodes
    }
    this.setState(newState);
    memory = newState;
  }

  hoverLayer(layerName){
    const hoverLayer = new CustomEvent('HOVER_LAYER', {detail: layerName})
    debounce(document.dispatchEvent(hoverLayer)), 4000;
  }
  
  unhoverLayer(layerName){
    const unhoverLayer = new CustomEvent('UNHOVER_LAYER', {detail: layerName})
    debounce(document.dispatchEvent(unhoverLayer)), 4000;
  }

  selectLayer(layerName){
    console.log(layerName)
    const selectLayer = new CustomEvent('SELECT_LAYER', {detail: layerName})
    document.dispatchEvent(selectLayer);
  }
  
  // unselectLayer(){
  //   const unselectLayer = new CustomEvent('UNSELECT_LAYER')
  //   document.dispatchEvent(unselectLayer);
  // }

  render() {
    return (
      <div className="legend">
        <div className='legend-titleBar'>
          <span className='legend-title'>Legend<span className='fa fa-list-ul' /></span>
          
        </div>
        <div className='legend-content'>
          <div className='legend-subtitleBar'>
            <span className='legend-subtitle'>
              {this.state.title === "NULL"
                ? null
                : this.state.title
              }
            </span>
          </div>
          <div className='legend-nodesContainer'>
            {this.renderLegendEntryNodes(this.state.nodesData)}
          </div>
        </div>
      </div>
    );
  }

  renderLegendEntryNodes(nodesData){
    const nodes = nodesData.map((nodeData, i) => {
      return (
        <LegendEntry key={i} description={nodeData.description} min={nodeData.min} max={nodeData.max} color={nodeData.color}
                     range={nodeData.range} layerHasFeatures={nodeData.layerHasFeatures} layerName={nodeData.layerName}
                     hoverLayer={this.hoverLayer} unhoverLayer={this.unhoverLayer} 
                     selectLayer={this.selectLayer} unselectLayer={this.unselectLayer} />
      )
    });
    return nodes;
  }
}
 export default Legend;