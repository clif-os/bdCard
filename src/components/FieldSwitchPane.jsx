import React, { Component } from 'react';
import FieldSwitchButton from './FieldSwitchButton.jsx'
import './FieldSwitchPane.styl';

class FieldSwitchPane extends Component {
  constructor (props) {
    super();
    var buttonStates = {};
    let activeField;
    props.fields.forEach((field, i) => {
      if (i === 0){
        buttonStates[field] = true;
        activeField = field;
      } else{
        buttonStates[field] = false;
      }
    });
    this.state = {
      fields: props.fields,
      activeField: activeField,
      buttonStates: buttonStates
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  };

  handleButtonClick(e){
    const clickedField = e.target.dataset.field;
    const activeField = this.state.activeField
    if (! this.state.buttonStates[clickedField]){
      var buttonStates = Object.assign({}, this.state.buttonStates);
      buttonStates[activeField] = false;
      buttonStates[clickedField] = true;
      this.setState({
        buttonStates: buttonStates,
        activeField: clickedField
      });
      window.activeField = clickedField;
      const evt = new CustomEvent('FIELD_SWITCH', { detail: clickedField });
      document.dispatchEvent(evt);
    };
  };

  render() {
    const fieldNodes = this.state.fields.map((field, i) => {
      // creating and passing in 'index' and 'length' in order to anticipate styling the first and last buttons differently 
      const index = i + 1;
      const active = this.state.buttonStates[field];
      return(
        <FieldSwitchButton key={i} index={index} field={field} length={this.props.fields.length} active={active} onClick={this.handleButtonClick} />
      )
    });
    return(
      <div className="fieldSwitchPane">
        <div className="fieldSwitchTitle">Chose Field:</div>
        <div className="fieldNodes">{fieldNodes}</div>
        <div className="paneSpacerHorizontal" />
      </div>
    )
  }
}

export default FieldSwitchPane;