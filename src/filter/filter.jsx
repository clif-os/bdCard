import {
  linePaintIn, fillPaintIn, linePaintOut, fillPaintOut,
  linePaintInPF, fillPaintInPF, linePaintOutPF, fillPaintOutPF,
  generatePaintArray,
  buildGeojsonLayerArray
} from '../mapbox/geojsonLayerUtils.jsx';
import {
  convertGJLayersToLegendData
} from '../components/legend/legendUtils.jsx';
import {
  splitGeojsonByCriteria
} from './filterUtils.jsx';

import gjPropsMetadata from '../data/jchs-boston-md.json';

const actions = ['FILTER', 'VISUALIZE_CLASSES', 'VISUALIZE_PASSFAIL', 'UNVISUALIZE'];

// all features
var _geojson;
// geojson of features within filter criteria
var _geojsonIn;
// geojson of features outside filter criteria
var _geojsonOut = null;
// last visCriteria
var _activeVisualizer = null
var _visCriteria = null;
var _passFailCriteria = null;
var _filtCriteria = null;
// general variables
var _visualization = false;

export const dashboardListener = () => {
  actions.forEach(action => {
    document.addEventListener(action, actionHandler.bind(this));
  });
};

const actionHandler = e => {
  const type = e['type'];
  let geojsonLayers;
  switch (type) {
    case 'FILTER':
      console.log('filtering');
      _geojson = window.geojson;
      _filtCriteria = e.detail;
      const splitGeojson = splitGeojsonByCriteria(geojson, _filtCriteria);
      _geojsonIn = splitGeojson.geojsonIn
      _geojsonOut = splitGeojson.geojsonOut
      if (! _visualization || (_visCriteria === null && _passFailCriteria === null)) {
        console.log('normal filtering')
        geojsonLayers = [{
          geojson: _geojsonIn,
          name: 'inFilter',
          filterStatus: 'Meets Filter Criteria',
          linePaint: linePaintIn,
          fillPaint: fillPaintIn
        }];
      } else {
        console.log('visualization filtering')
        if (_activeVisualizer === 'passFail'){
          const splitGeojsonPF = splitGeojsonByCriteria(_geojsonIn, _passFailCriteria);
          var _geojsonPass = splitGeojsonPF.geojsonIn
          var _geojsonFail = splitGeojsonPF.geojsonOut
          geojsonLayers = [{
              geojson: _geojsonPass,
              name: 'pass',
              filterStatus: 'Passes Visualization Criteria',
              linePaint: linePaintInPF,
              fillPaint: fillPaintInPF
            },
            {
              geojson: _geojsonFail,
              name: 'fail',
              filterStatus: 'Fails Visualization Criteria',
              linePaint: linePaintOutPF,
              fillPaint: fillPaintOutPF
            }];
            } else if (_activeVisualizer === 'classes'){
          geojsonLayers = buildGeojsonLayerArray(_geojsonIn, _visCriteria.field, _visCriteria.classes, _visCriteria.palette, _visCriteria.unitFormatter);
        }
      }
      const updateCount = new CustomEvent('UPDATE_FILTER_SECTION', {
        'detail': {
          numFeaturesInFilter: _geojsonIn.features.length,
          numFeaturesTotal: _geojson.features.length
        }
      });
      document.dispatchEvent(updateCount);
      window.activeFeatureCount = _geojsonIn.features.length;
      dispatchFilterEvents(geojsonLayers);
      break;
    case 'UNVISUALIZE':
    // don't unvisualize twice in a row
      if (! _visualization) break;
      _visCriteria = null;
      geojsonLayers = [{
          geojson: _geojsonIn,
          name: 'inFilter',
          filterStatus: 'Meets Filter Criteria',
          linePaint: linePaintIn,
          fillPaint: fillPaintIn
        }];
      dispatchFilterEvents(geojsonLayers);
      _visualization = false;
      break;
    case 'VISUALIZE_CLASSES':
    _activeVisualizer = 'classes'
      if (_geojsonIn === undefined) {
        _geojsonIn = window.geojson;
      }
      _visCriteria = e.detail;
      geojsonLayers = buildGeojsonLayerArray(_geojsonIn, _visCriteria.field, _visCriteria.classes, _visCriteria.palette, _visCriteria.unitFormatter);
      dispatchFilterEvents(geojsonLayers);
      _visualization = true;
      break;
    case 'VISUALIZE_PASSFAIL':
      _activeVisualizer = 'passFail'
      if (_geojsonIn === undefined) {
        _geojsonIn = window.geojson;
      }
      _passFailCriteria = e.detail;
      const splitGeojsonPF = splitGeojsonByCriteria(_geojsonIn, _passFailCriteria);
      var _geojsonPass = splitGeojsonPF.geojsonIn
      var _geojsonFail = splitGeojsonPF.geojsonOut
      geojsonLayers = [{
          geojson: _geojsonPass,
          name: 'pass',
          filterStatus: 'Passes Visualization Criteria',
          linePaint: linePaintInPF,
          fillPaint: fillPaintInPF
        },
        {
          geojson: _geojsonFail,
          name: 'fail',
          filterStatus: 'Fails Visualization Criteria',
          linePaint: linePaintOutPF,
          fillPaint: fillPaintOutPF
        }];
      dispatchFilterEvents(geojsonLayers);
      _visualization = true;
      break;
    default:
      break;
  }
}

const dispatchFilterEvents = geojsonLayers => {
  // push in the filtered-out layers
  if (_geojsonOut !== null) {
    if (_geojsonOut.features.length > 0) {
      geojsonLayers.push({
        geojson: _geojsonOut,
        name: 'outFilter',
        filterStatus: 'Does Not Meet Filter Criteria',
        linePaint: linePaintOut,
        fillPaint: fillPaintOut
      });
    }
  }
  const draw = new CustomEvent('DRAW_NEW_GJ', {
    'detail': geojsonLayers
  });
  document.dispatchEvent(draw);
  const legendDescription = _visCriteria === null ? 'NULL' : gjPropsMetadata[_visCriteria.field].description;
  const legendData = convertGJLayersToLegendData(geojsonLayers, legendDescription);
  const updateLegend = new CustomEvent('UPDATE_LEGEND', {
    'detail': legendData
  });
  document.dispatchEvent(updateLegend);
}