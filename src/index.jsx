import './index.styl';
import React from 'react';
import {
  render
} from 'react-dom';
require('velocity-animate');
require('velocity-animate/velocity.ui');
import AppInterface from './AppInterface.jsx';
import Map from './mapbox/Map.jsx';
import { linePaintIn, fillPaintIn } from './mapbox/geojsonLayerUtils.jsx';
import { convertGeojsonToLookup } from './utils/geojsonUtils.jsx'
global.mapboxgl = require('mapbox-gl');
import { dashboardListener } from './filter/filter.jsx'
import gj from './data/jchs-boston-norm.json';
import gjPropsMetadata from './data/boston_props_metadata.json';
import { convertGJLayersToLegendData } from './components/legend/legendUtils.jsx';


const geojsonTilesets = [
  {
    name: 'jchsBoston',
    sourceUrl: 'mapbox://mimio.3psqk33y',
    sourceLayer: 'boston'
  }
];

// for selections, it can often be useful to make a lookup tranformation of the geojsons at hand
// in order to perform rapid lookups --> things like selections and even zooms
window.activeFields = {};
window.geojsonLookup = convertGeojsonToLookup(gj);
window.geojson = gj;
const geojsonLayers = [
  {
    geojson: gj,
    name: 'inFilter',
    filterStatus: 'Meets Filter Criteria',
    linePaint: linePaintIn,
    fillPaint: fillPaintIn
  }
]
const legendDescription = 'NULL';
const legendData = convertGJLayersToLegendData(geojsonLayers, legendDescription);
// empty window object for making selections
window.selectedFeature = null;

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FtcC1hbW9zIiwiYSI6ImNpcjg0cTJvMzAweThnZG5rY2Znazhnc2kifQ.jLCXm1LQmHyDC2RaFTBJNA';
const mapStyle = 'mapbox://styles/mapbox/streets-v9' // streets style
// const mapStyle = 'mapbox://styles/mapbox/outdoors-v9' //outdoors style
// const mapStyle="mapbox://styles/camp-amos/ciwn0ej5z00402pnxt5t42d4o"; //light style
// const mapStyle = "mapbox://styles/camp-amos/cirmc9juf002hg1nboacfr7u9"; // dark style
dashboardListener();
const m = new Map(geojsonLayers, mapStyle);
render( <AppInterface propsMd={gjPropsMetadata} legendData={legendData}/> ,
  document.getElementById('AppInterface')
);
