import './index.styl';
import React from 'react';
import {render} from 'react-dom';
// import {Provider} from 'react-redux';
// import {store} from './state/store';
import AppInterface from './AppInterface.jsx';
import Map from './Map.jsx';
import NINETY from './data/TBF_TM_1990_norm.json'
import THOUSAND from './data/TBF_TM_2000_norm.json'
import TEN from './data/TBF_TM_2010_norm.json'
import FOURTEEN from './data/TBF_TM_2014_norm.json'
import ALLYEARS from './data/TBF_TM_all.json'
import { convertGeojsonToLookup } from './utils/geojsonUtils.jsx'
global.mapboxgl = require('mapbox-gl');

const geojsons = {
  "1990": NINETY,
  "2000": THOUSAND,
  "2010": TEN,
  "2014":FOURTEEN,
  "allYears": ALLYEARS
};

const fields = ["MedInc"];

window.geojsonLookup = convertGeojsonToLookup(geojsons.allYears);

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FtcC1hbW9zIiwiYSI6ImNpcjg0cTJvMzAweThnZG5rY2Znazhnc2kifQ.jLCXm1LQmHyDC2RaFTBJNA';
const mapStyle="mapbox://styles/camp-amos/ciwn0ej5z00402pnxt5t42d4o";

const m = new Map(geojsons, mapStyle, fields);

render(
  <AppInterface />,
  document.getElementById('AppInterface')
);

