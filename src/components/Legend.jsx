import React, { Component } from 'react';
import LegendEntry from './LegendEntry.jsx';
import './Legend.styl';

class Legend extends Component {
  constructor (props) {
    super();
    const activeField = window.activeField
    this.state = {
      legendItems: props.legendFormats[activeField].stops,
      legendTitle: props.legendFormats[activeField].field
    }
    this.loadField = this.loadField.bind(this);
    document.addEventListener('FIELD_SWITCH', this.loadField);
  };

  compontDidMount(){
  }

  loadField(){
    const activeField = window.activeField
    this.setState({
      legendItems: this.props.legendFormats[activeField].stops,
      legendTitle: this.props.legendFormats[activeField].field
    })
  };

  render(){
     const unit = this.props.legendFormats[window.activeField].unit
     const legendEntryNodes = this.state.legendItems.map((legendEntry, i) => {
      return(
        <LegendEntry key={i} valueMin={legendEntry[0]} valueMax={legendEntry[1]} color={legendEntry[2]} unit={unit}/>
      );
    });

    return(
      <div className="legend">
        <span className="legendTitle">{this.state.legendTitle}</span>
        <div className="legendItems">
        {legendEntryNodes}
        </div>
      </div>
    )
  };
};

export default Legend;