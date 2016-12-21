import React from 'react';
import SelectionTable from './SelectionTable.jsx';
import SelectionGraphs from './SelectionGraphs.jsx';
import { filterInProperties, filterOutProperties } from '../utils/geojsonUtils.jsx';
import './SelectionPaneContent.styl'

function SelectionPaneContent(props) {

  console.log("RENDERING SELECTION PANE");

  const titleFieldsIn = [
    "NAMELSAD"
  ];
  const tableFieldsOut = [
    "NAMELSAD"
  ];
  
  const titleProperties = filterInProperties(props.selectedFeature.properties, titleFieldsIn);
  const tableProperties = filterOutProperties(props.selectedFeature.properties, tableFieldsOut);
  const graphFields = ["year", "MedInc"]; // x,y
  return (
    <div className="selectionPaneContent">
      <div className="selectionTitleBar"><span className="selectionTitle">{titleProperties["NAMELSAD"]}</span></div>
      <div className="paneSpacerHorizontal" />
      <SelectionTable selectedFeatureProperties={tableProperties}/>
      <div className="paneSpacerHorizontal" />
      <SelectionGraphs selectedFeatureProperties={props.selectedFeature.properties} fieldsToGraph={graphFields}/>
    </div>
  );
}

export default SelectionPaneContent;