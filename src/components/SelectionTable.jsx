import React, { Component } from 'react';
import SelectionTableEntry from './SelectionTableEntry.jsx';
import './SelectionTable.styl';

class SelectionTable extends Component {
  constructor(props){
    super();
  }

  render() {
    const properties = this.props.selectedFeatureProperties
    var index = 0
    const selectionTableEntryNodes = Object.keys(properties).map((key, i) => {
      index++;
      return(
        <SelectionTableEntry key={i} index={index} property={key} value={properties[key]} />
      );
    });
    return(
      <div className="selectionTableContainer">
        <table className="selectionTable">
          {selectionTableEntryNodes}
        </table>
      </div>
    )
  }
}

export default SelectionTable;