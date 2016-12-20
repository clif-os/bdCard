import React from 'react';
import './LegendEntry.styl';
import { dollarFormatter } from '../utils/reactUtils.jsx'

function LegendEntry(props) {
  let min;
  let max;
  if (props.unit === 'dollar'){
    min = dollarFormatter(props.valueMin);
    max = dollarFormatter(props.valueMax);
  } else{
    min = props.valueMin;
    max = props.valueMax;
  }
  
  const style = {
    color: props.color,
    opacity: 0.6
  }
  return (
    <div className="legendEntry"><span className="fa fa-square" style={style} /><span className="value">{min} - {max}</span></div>
  );
}

// LegendEntry.propTypes = {
//   onClick: React.PropTypes.func
// };

export default LegendEntry;