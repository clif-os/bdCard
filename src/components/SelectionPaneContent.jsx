import React from 'react';
import SelectionPaneZoom from './SelectionPaneZoom.jsx';
import SelectionTable from './SelectionTable.jsx';
import SelectionGraphs from './SelectionGraphs.jsx';
import { filterInProperties, filterOutProperties } from '../utils/geojsonUtils.jsx';
import './SelectionPaneContent.styl'

function SelectionPaneContent(props) {
  // console.log("RENDERING SELECTION PANE");

  const handleSelectionPaneZoom = () => {
    const evt = new CustomEvent("ZOOM_TO_FEATURE");
    document.dispatchEvent(evt)
  } 

  const titleFieldsIn = [
    "NAMELSAD"
  ];
  const tableFieldsOut = [
    "NAMELSAD"
  ];

  const titleProperties = filterInProperties(props.selectedFeature.properties, titleFieldsIn);
  const tableProperties = filterOutProperties(props.selectedFeature.properties, tableFieldsOut);
  // Selection Graphs is built to map over year based off of the syntax of incoming data from Harvard
  // because the year (x-axis of the graphs) is build into the fields of interest, the xFIeld of the graphs are parsed automatically
  // within d3Utils -- you only need to pass in starting tags via yFields which meet the criteria of having corresponding
  // geojson feature property columns: '<yFieldTag>90', '<yFieldTag>00', '<yFieldTag>10', '<yFieldTag>14'
  const yFields = ["MedInc", "DMI", "MedRent", "DMR"];
  return (
    <div className="selectionPaneContent">
      <div className="selectionTitleBar"><span className="selectionTitle">{titleProperties["NAMELSAD"]}</span><SelectionPaneZoom onClick={handleSelectionPaneZoom} feature={props.selectedFeature} /></div>
      <div className="paneSpacerHorizontal" />
      <SelectionTable selectedFeatureProperties={tableProperties}/>
      <div className="paneSpacerHorizontal" />
      <SelectionGraphs selectedFeatureProperties={props.selectedFeature.properties} yFields={yFields} />
    </div>
  );
}

export default SelectionPaneContent;