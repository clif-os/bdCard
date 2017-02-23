import './index.styl';
import React from 'react';
import {
  render
} from 'react-dom';
require('velocity-animate');
require('velocity-animate/velocity.ui');
import AppInterface from './AppInterface.jsx';
import Map from './Map.jsx';
import { convertGeojsonToLookup } from './utils/geojsonUtils.jsx'
global.mapboxgl = require('mapbox-gl');
// import local data for now, later this should be pulled from the tilesets group from online using the mapbox dataset API
// import gj from './data/boston_data_4326_clean.json'
// import gj from './data/boston_data_TEMP.json'
import gj from './data/jchs-boston.json';
import gjPropsMetadata from './data/boston_props_metadata.json';



const geojsonTilesets = [
  {
    name: 'jchsBoston',
    sourceUrl: 'mapbox://mimio.375tendc',
    sourceLayer: 'jchs-boston-ba9eig'
  }
];

// for selections, it can often be useful to make a lookup tranformation of the geojsons at hand
// in order to perform rapid lookups --> things like selections and even zooms
window.geojsonLookup = convertGeojsonToLookup(gj);
window.geojson = gj;
// empty window object for making selections
window.selectedFeature = null;

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FtcC1hbW9zIiwiYSI6ImNpcjg0cTJvMzAweThnZG5rY2Znazhnc2kifQ.jLCXm1LQmHyDC2RaFTBJNA';
const mapStyle = 'mapbox://styles/mapbox/outdoors-v9' //outdoors style
// const mapStyle="mapbox://styles/camp-amos/ciwn0ej5z00402pnxt5t42d4o"; //light style
// const mapStyle = "mapbox://styles/camp-amos/cirmc9juf002hg1nboacfr7u9"; // dark style

const m = new Map(geojsonTilesets, mapStyle);
render( <AppInterface propsMd={gjPropsMetadata} / > ,
  document.getElementById('AppInterface')
);