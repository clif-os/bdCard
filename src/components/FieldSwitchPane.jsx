import React, { Component } from 'react';
import './FieldSwitchPane.styl';

class FieldSwitchPane extends Component {
  constructor (props) {
    super();
    this.state = {
      fields: props.fields
    }
  };

  render() {
    console.log(this.props.fields);
    return(
      <div className="fieldSwitchPane">
        <div className="fieldSwitchPane">Chose Field:</div>
      </div>
    )
  }
}

export default FieldSwitchPane;