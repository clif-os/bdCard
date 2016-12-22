import React from 'react';
import './SelectionPaneZoom.styl'

function SelectionPaneZoom(props) {
  const geoid = props.feature.properties.GEOID
  return (
    <div className="selectionPaneZoom" onClick={props.onClick} data-tooltip="Zoom To Feature"><span className="fa fa-arrows-alt" /></div>
  );
}

export default SelectionPaneZoom;