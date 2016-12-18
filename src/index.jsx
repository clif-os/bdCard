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
import {
  generateChoroplethStylers
} from './utils/mapboxUtils.jsx'
global.mapboxgl = require('mapbox-gl');

const geojsons = {
  "1990": NINETY,
  "2000": THOUSAND,
  "2010": TEN,
  "2014":FOURTEEN,
  "allYears": ALLYEARS
};

const geojsonTilesets = {
  "1990": 'mapbox://chiefkleef.ciwsi0jvr00042zsajry2n8i5-76muo',
  "2000": 'mapbox://chiefkleef.ciwsi1u70000a2zo0ju9mv8ua-7us1b',
  "2010": 'mapbox://chiefkleef.ciwsi2t16000a2oqb38rrj4wp-17zg8',
  "2014": 'mapbox://chiefkleef.ciwsi3t61000a2oqrgwq8qo96-4h7fn',
  "allYears": 'mapbox://chiefkleef.ciwsgz6s0142u30s5egh3z1u0-20lot'
};

const years = [1990, 2000, 2010, 2014];
window.activeYear = years[0];
const fields = ["MedInc", "DMI", "MedRent", "DMR"];
window.activeField = fields[0];
const stylers = generateChoroplethStylers(geojsons.allYears, fields, 5);
const fillStyles = stylers.fillStyles;
const legendFormats = stylers.legendFormats; 

window.geojsonLookup = convertGeojsonToLookup(geojsons.allYears);

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FtcC1hbW9zIiwiYSI6ImNpcjg0cTJvMzAweThnZG5rY2Znazhnc2kifQ.jLCXm1LQmHyDC2RaFTBJNA';
const mapStyle="mapbox://styles/camp-amos/ciwn0ej5z00402pnxt5t42d4o";

const m = new Map(geojsons, geojsonTilesets, mapStyle, fields, fillStyles, years);

render(
  <AppInterface years={years} legendFormats={legendFormats} fields={fields} />,
  document.getElementById('AppInterface')
);

