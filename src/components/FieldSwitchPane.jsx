import React, { Component } from 'react';
import FieldSwitchButton from './FieldSwitchButton.jsx'
import './FieldSwitchPane.styl';

class FieldSwitchPane extends Component {
  constructor (props) {
    super();
    var buttonStates = {};
    props.fields.forEach((field, i) => {
      console.log(i)
      if (i === 0){
        buttonStates[field] = true;
      } else{
        buttonStates[field] = false;
      }
    });
    this.state = {
      fields: props.fields,
      buttonStates: buttonStates
    };
  };

  render() {
    const fieldNodes = this.state.fields.map((field, i) => {
      // creating and passing in 'index' and 'length' in order to anticipate styling the first and last buttons differently 
      const index = i + 1;
      const active = this.state.buttonStates[field];
      return(
        <FieldSwitchButton key={i} index={index} field={field} length={this.props.fields.length} active={active} />
      )
    })
    console.log(fieldNodes);
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