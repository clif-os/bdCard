import React from 'react';
import './SelectionTableEntry.styl';
import { dollarFormatter } from '../utils/reactUtils.jsx'

function SelectionTableEntry(props) {
  let style;
  (props.index % 2 === 0)
    ? style = {
        backgroundColor: 'rgba(220,220,220, .5)'
      }
    : style = {
        backgroundColor: 'rgba(255,255,255, .5)'
      }
  return (
    <tr className="selectionTableEntry" style={style}>
      <td id="col1">{props.property}</td>
      <td id="col2">{props.value}</td>
    </tr>
  );
}

// LegendEntry.propTypes = {
//   onClick: React.PropTypes.func
// };

export default SelectionTableEntry;