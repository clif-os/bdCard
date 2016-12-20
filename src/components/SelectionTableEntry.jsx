import React from 'react';
import './SelectionTableEntry.styl';
import { dollarFormatter } from '../utils/reactUtils.jsx'

function SelectionTableEntry(props) {
  return (
    <div className="selectionTableEntry">{props.property} : {props.value}</div>
  );
}

// LegendEntry.propTypes = {
//   onClick: React.PropTypes.func
// };

export default SelectionTableEntry;