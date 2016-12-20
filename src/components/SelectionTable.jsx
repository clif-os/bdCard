import React, { Component } from 'react';
import SelectionTableEntry from './SelectionTableEntry.jsx';
import './SelectionTable.styl';

class SelectionTable extends Component {
  constructor(props){
    super();
    this.state = {
      properties: props.selectedFeatureProperties
    }
  }

  render() {
    console.log(this.state.properties);
    const selectionTableEntryNodes = Object.keys(this.state.properties).map((key, i) => {
      return(
        <SelectionTableEntry property={key} value={this.state.properties[key]} />
      );
    });
    return(
      <div className="selectionTable">
        {selectionTableEntryNodes}
      </div>
    )
  }
}

export default SelectionTable;