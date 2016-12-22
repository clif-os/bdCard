import React from 'react';
import './MBFullExtentButton.styl';

function MBFullExtentButton(props) {

  return (
    <div className="mBFullExtentButton" onClick={props.onClick}><span className="fa fa-expand" /></div>
  );
}

export default MBFullExtentButton;