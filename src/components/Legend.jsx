import React, { Component } from 'react';
import LegendEntry from './LegendEntry.jsx';
import './Legend.styl';

class Legend extends Component {
  constructor (props) {
    super();
    this.state = {
      legendItems: props.legend.stops,
      legendTitle: props.legend.field
    }
  };

  compontDidMount(){
    document.addEventListener('LOAD_FIELD', this.loadField().bind(this));
  }

  loadField(){
    const legend = window.fillColorStyle   
    this.setState({
      legendItems: legend.stops,
      legendTitle: legend.property
    })
  };

  render(){

     const legendNodes = this.state.legendItems.map((legendEntry, i) => {
      return(
        <LegendEntry key={i} valueMin={legendEntry[0]} valueMax={legendEntry[1]} color={legendEntry[2]} />
      )
    });

    return(
      <div className="legend">
        <span className="legendTitle">{this.state.legendTitle}</span>
        <div className="legendItems">
        {legendNodes}
        </div>
      </div>
    )
  };
};

export default Legend;