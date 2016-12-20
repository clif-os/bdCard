import React from 'react';
import SelectionTable from './SelectionTable.jsx';
import './SelectionPaneContent.styl'

function SelectionPaneContent(props) {
  return (
    <div className="selectionPaneContent">
      <SelectionTable selectedFeatureProperties={props.selectedFeature.properties}/>
    </div>
  );
}

export default SelectionPaneContent;