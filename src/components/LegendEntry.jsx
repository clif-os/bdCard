import React from 'react';
import './LegendEntry.styl';
import { dollarFormatter } from '../utils/reactUtils.jsx'

function LegendEntry(props) {
  const value = dollarFormatter(props.value);
  const style = {
    color: props.color
  }
  return (
    <div className="legendEntry"><span className="fa fa-square" style={style} /><span className="value">{value}</span></div>
  );
}

// LegendEntry.propTypes = {
//   onClick: React.PropTypes.func
// };

export default LegendEntry;