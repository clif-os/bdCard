import React, { Component } from 'react';
import FieldSwitchButton from './FieldSwitchButton.jsx'
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

    const fieldNodes = this.state.fields.map(field => {
      <FieldSwitchButton field={field} />
    })

    return(
      <div className="fieldSwitchPane">
        <div className="fieldSwitchTitle">Chose Field:</div>
        {fieldNodes}
        <div className="paneSpacerHorizontal" />
      </div>
    )
  }
}

export default FieldSwitchPane;