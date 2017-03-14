import React from 'react';
import './Legend.styl';
import LegendEntry from './LegendEntry.jsx';
import { toTitleCase } from '../../utils/generalUtils.jsx'

var memory = null

class Legend extends React.Component {
  constructor(props){
    super();
    const activeFeatureCount = window.activeFeatureCount === undefined ? window.geojson.features.length : window.activeFeatureCount;
    memory === null 
      ? this.state = {
          title: props.legendData.description,
          nodesData: props.legendData.nodes,
          featureCountMessage: `Showing All ${activeFeatureCount} Tracts`
        }
      : this.state = memory;
    document.addEventListener('UPDATE_LEGEND', this.updateLegend.bind(this));
    document.addEventListener('UPDATE_FILTER_SECTION', this.updateFeatureCount.bind(this));
    this.updateFeatureCount = this.updateFeatureCount.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('UPDATE_FILTER_SECTION', this.updateFeatureCount.bind(this));
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
    const zoomToLayer = new CustomEvent('ZOOM_TO_LAYER', {detail: layerName});
    document.dispatchEvent(zoomToLayer);
  }
  
  // unselectLayer(){
  //   const unselectLayer = new CustomEvent('UNSELECT_LAYER')
  //   document.dispatchEvent(unselectLayer);
  // }

  updateFeatureCount(e){
    const subtotal = e.detail.numFeaturesInFilter;
    const total = e.detail.numFeaturesTotal;
    let message;
    if (subtotal === total){
      message = `Showing All ${total} Tracts`
    } else if (subtotal < total) {
      message = `Showing ${subtotal} of ${total} Tracts`
    }
    this.setState({
      featureCountMessage: message
    });
  }

  render() {
    return (
      <div className="legend">
        <div className='legend-titleBar'>
          <span className='legend-title'>
            {this.state.title === "NULL"
              ? 'Legend'
              : toTitleCase(this.state.title)
            }
          </span>
          
        </div>
        <div className='legend-content'>
          <div className='legend-nodesContainer'>
            {this.renderLegendEntryNodes(this.state.nodesData)}
          </div>
        </div>
        <div className="featureCountContainer">
          <span className='featureCountMessage'>{this.state.featureCountMessage}</span>
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

 //<span className='fa fa-list-ul' />