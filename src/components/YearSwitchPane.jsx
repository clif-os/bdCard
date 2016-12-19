import React, { Component } from 'react';
import YearSlider from './YearSlider.jsx';
import './YearSwitchPane.styl';

class YearSwitchPane extends Component {
  constructor(props){
    super();
  }

  render() {
    return(
      <div className="yearSwitchPane">
        <div className="yearSwitchTitle">Choose Year:</div>
        <YearSlider years={this.props.years}/>
        <div className="paneSpacerHorizontal" />
      </div>
    )
  }
}

export default YearSwitchPane;