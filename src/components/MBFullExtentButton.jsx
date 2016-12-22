import React from 'react';
import './MBFullExtentButton.styl';

function MBFullExtentButton(props) {

  return (
    <div className="mBFullExtentButton" onClick={props.onClick} data-tooltip="Full Extent"><span className="fa fa-arrows-alt" /></div>
  );
}

export default MBFullExtentButton;