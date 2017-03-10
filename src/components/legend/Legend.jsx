import React from 'react';
import './Legend.styl';
import LegendEntry from './LegendEntry.jsx';

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

  hoverLayer(layerName, index){
    const hoverLayer = new CustomEvent('HOVER_LAYER', {detail: layerName});
    document.dispatchEvent(hoverLayer);
  }
  
  unhoverLayer(layerName, layerColor){
    const unhoverLayer = new CustomEvent('UNHOVER_LAYER', {detail: {layerName: layerName, layerColor: layerColor}});
    document.dispatchEvent(unhoverLayer);
  }

  selectLayer(layerName){
    console.log('AQUI1')
    const zoomToLayer = new CustomEvent('ZOOM_TO_LAYER', {detail: layerName});
    document.dispatchEvent(zoomToLayer);
    console.log('AQUI2')
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
      const index = i + 1;
      return (
        <LegendEntry key={i} description={nodeData.description} min={nodeData.min} max={nodeData.max} color={nodeData.color}
                     range={nodeData.range} layerHasFeatures={nodeData.layerHasFeatures} layerName={nodeData.layerName}
                     hoverLayer={this.hoverLayer} unhoverLayer={this.unhoverLayer} 
                     selectLayer={this.selectLayer} unselectLayer={this.unselectLayer} 
                     index={index} />
      )
    });
    return nodes;
  }
}
 export default Legend;