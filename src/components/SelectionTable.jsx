import React, { Component } from 'react';
import SelectionTableEntry from './SelectionTableEntry.jsx'; 
import './SelectionTable.styl';

class SelectionTable extends Component {
  constructor(props){
    super();
  }

  render() {
    const tableEntryNodes = Object.keys(this.props.selectedFeature)
    return(
      <div className="selectionTable">
        ASUH
      </div>
    )
  }
}

export default SelectionTable;