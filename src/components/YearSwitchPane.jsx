import React, { Component } from 'react';
import YearSlider from './YearSlider.jsx';

class YearSwitchPane extends Component {
  constructor(props){
    super();
  }

  render() {
    return(
      <div className="yearSwitchPane">
        <div className="yearSwitchTitle">Years</div>
        <YearSlider years={this.props.years}/>
      </div>
    )
  }
}

export default YearSwitchPane;