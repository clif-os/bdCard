import './index.styl';
import React from 'react';
import {render} from 'react-dom';
require('velocity-animate');
require('velocity-animate/velocity.ui');
require('rc-slider/assets/index.css');
require('rc-tooltip/assets/bootstrap.css');

import AppInterface from './AppInterface.jsx';
import Map from './mapbox/Map.jsx';
import { buildPaint } from './mapbox/geojsonLayerUtils.jsx';
import {convertGeojsonToLookup} from './utils/geojsonUtils.jsx'
global.mapboxgl = require('mapbox-gl');
import {dashboardListener} from './filter/filter.jsx'

window.fetch = window.fetch || require('fetch-ie8');
window.Promise = window.Promise || require('promise-polyfill');
require('es6-shim');
require('custom-event-polyfill');

// CUSTOM TESTING MODE //
window.troubleshootMode = true;

import gjPropsMetadata from './data/jchs-boston-md.json';
import {convertGJLayersToLegendData} from './components/legend/legendUtils.jsx';

// for the default visEvent
import {dollarFormatter} from './utils/generalUtils.jsx';

let url;
if (__DEV__) {
  url = 'http://localhost:3000/json';
} else {
  url = 'https://panettone.herokuapp.com/json';
}

fetch(url)
  .then(res => res.json())
  .then(gj => {
    // for selections, it can often be useful to make a lookup tranformation of the
    // geojsons at hand in order to perform rapid lookups --> things like selections
    // and even zooms
    window.geojsonLookup = convertGeojsonToLookup(gj);
    window.geojson = Object.assign({}, gj);
    window.geojsonFiltered = Object.assign({}, gj);
    const { linePaint, fillPaint } = buildPaint('defaultPass');
    const geojsonLayers = [
      {
        geojson: gj,
        name: 'inFilter',
        filterStatus: 'Meets Filter Criteria',
        linePaint: linePaint,
        fillPaint: fillPaint
      }
    ]
    const legendDescription = 'NULL';
    const legendData = convertGJLayersToLegendData(geojsonLayers, legendDescription);
    window.defaultVisEvent = {
      "field": "MedINC14",
      "classes": 4,
      "palette": "red to green",
      "unitFormatter": dollarFormatter,
      "visActive": true
    }
    // loading activeVisFields with a default value that is represented in a superficial visualization event from the Map.jsx
    window.activeFields = {};
    window.activeVisFields = {};
    window.activeFiltFields = {};
    // empty window object for making selections
    window.selectedFeature = null;

    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FtcC1hbW9zIiwiYSI6ImNpcjg0cTJvMzAweThnZG5rY2Znazhnc2kifQ.jLCXm1LQmH' +
        'yDC2RaFTBJNA';
    const mapStyle = 'mapbox://styles/mapbox/streets-v9' // streets style
    // const mapStyle = 'mapbox://styles/mapbox/outdoors-v9' //outdoors style const
    // mapStyle="mapbox://styles/camp-amos/ciwn0ej5z00402pnxt5t42d4o"; //light
    // style const mapStyle = "mapbox://styles/camp-amos/cirmc9juf002hg1nboacfr7u9";
    // // dark style
    dashboardListener();
    const m = new Map(geojsonLayers, mapStyle);
    render(
        <AppInterface propsMd={gjPropsMetadata} legendData={legendData}/>, document.getElementById('AppInterface'));
  });
