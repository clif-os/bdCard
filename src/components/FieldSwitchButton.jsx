import React from 'react';
import './FieldSwitchButton.styl';

function FieldSwitchButton(props) {
  const { field, index, length, active } = props
  console.log(active);
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
  // switch (active) {
  //   case true:
  //     style.backgroundColor = 'rgb(75,75,75)';
  //     style.color = 'white';
  //     break;
  //   case false:
  //     style.color = 'rgb(0,0,0)';
  //     break;
  //   default:
  //     break;
  // }
  return (
    <div className='fieldSwitchButton'  id={active} style={style}><span className="fieldSwitchText">{field}</span></div>
  );
}

// LegendEntry.propTypes = {
//   onClick: React.PropTypes.func
// };

export default FieldSwitchButton;