import React from 'react';
import './FieldSwitchButton.styl';

function FieldSwitchButton(props) {
  const { field, index, length, active, onClick } = props
  let style;
  switch (index) {
    case 1:
      style = {
        marginLeft: '5px',
        marginRight: '1px'
      }
      break;
    case length:
      style = {
        marginLeft: '1px',
        marginRight: '5px'
      }
      break;
    default:
      style = {
        marginLeft: '1px',
        marginRight: '1px'
      }
      break;
  }
  return (
    <div className='fieldSwitchButton'  id={active} style={style} data-field={field} onClick={onClick} data-tooltip={props.dataTooltip}><span className="fieldSwitchText">{field}</span></div>
  );
}

// LegendEntry.propTypes = {
//   onClick: React.PropTypes.func
// };

export default FieldSwitchButton;