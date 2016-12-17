import React, { Component } from 'react';
import Slider from 'rc-slider-hostile-fork';
import 'rc-slider-hostile-fork/assets/index.css';
import './YearSlider.styl';

const buildMarks = steps => {
  var marks = {};
  steps.forEach(step => {
    marks[step] = String(step);
  });
  return marks;
}

class YearSlider extends Component {

  constructor(props) {
    super();
    this.handleYearSwitch = this.handleYearSwitch.bind(this);
  }

  handleYearSwitch(e) {
    const yearChoice = String(e);
    const evt = new CustomEvent('YEAR_SWITCH', { detail: yearChoice });
    document.dispatchEvent(evt);
  }

  render() {
    const steps = this.props.years;
    const marks = buildMarks(steps);
    const min = steps[0]
    const max = steps[steps.length-1]
    return (
      <div className="year-slider">
        <Slider marks={marks} min={min} max={max} step={null} tipFormatter={null} onAfterChange={this.handleYearSwitch} pushable={true} />
      </div>
    );
  }
}

YearSlider.propTypes = {
  years: React.PropTypes.array,
};

export default YearSlider;

//defaultValue={min} min={min} max={max}
