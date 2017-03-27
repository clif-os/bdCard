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
          featureCountMessage: `Showing All ${activeFeatureCount} Tracts`,
          featureCountTotal: activeFeatureCount,
          entryHovered: false,
          entryHoveredMessage: null
        }
      : this.state = memory;
    document.addEventListener('UPDATE_LEGEND', this.updateLegend.bind(this));
    document.addEventListener('UPDATE_FILTER_SECTION', this.updateFeatureCount.bind(this));
    this.updateFeatureCount = this.updateFeatureCount.bind(this);
    this.hoverLayer = this.hoverLayer.bind(this);
    this.unhoverLayer = this.unhoverLayer.bind(this);
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

  hoverLayer(layerName, featureCount){
    const percent = Math.round((featureCount / this.state.featureCountTotal) * 100);
    this.setState({
      entryHovered: true,
      entryHoveredMessage: `${featureCount} / ${this.state.featureCountTotal} Tracts (${percent}%)`
    });
    if (featureCount > 0){
      const hoverLayer = new CustomEvent('HOVER_LAYER', {detail: layerName});
      document.dispatchEvent(hoverLayer);
    }
  }
  
  unhoverLayer(layerName, layerColor, layerHasFeatures){
    this.setState({
      entryHovered: false
    });
    if (layerHasFeatures){
      const unhoverLayer = new CustomEvent('UNHOVER_LAYER', {detail: {layerName: layerName, layerColor: layerColor}});
      document.dispatchEvent(unhoverLayer);
    }
  }

  selectLayer(layerName){
    const zoomToLayer = new CustomEvent('ZOOM_TO_LAYER', {detail: layerName});
    document.dispatchEvent(zoomToLayer);
  }

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
      featureCountMessage: message,
      featureCountTotal: total
    });
  }

  render() {
    return (
      <div className="legend">
        <div className='legend-mainContent'>
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
        </div>
        <div className="featureCountContainer">
          {this.state.entryHovered
            ? <span className='featureCountMessage'>{this.state.entryHoveredMessage}</span>
            : <span className='featureCountMessage'><span className='fa fa-filter' />{this.state.featureCountMessage}</span>
          }
        </div>
      </div>
    );
  }

  renderLegendEntryNodes(nodesData){
    const nodes = nodesData.map((nodeData, i) => {
      const index = i + 1;
      return (
        <LegendEntry key={i} description={nodeData.description} min={nodeData.min} max={nodeData.max} color={nodeData.color}
                     range={nodeData.range} layerHasFeatures={nodeData.layerHasFeatures} featureCount={nodeData.layerFeatureCount}
                     layerName={nodeData.layerName}
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