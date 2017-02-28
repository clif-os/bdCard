import {
  linePaintIn,
  fillPaintIn,
  linePaintOut,
  fillPaintOut,
  generatePaintArray,
  buildGeojsonLayerArray
} from '../mapbox/geojsonLayerUtils.jsx';
import {
  convertGJLayersToLegendData
} from '../components/legend/legendUtils.jsx';
import {
  splitGeojsonByCriteria
} from './filterUtils.jsx';

const actions = ['FILTER', 'VISUALIZE'];

// all features
var _geojson;
// geojson of features within filter criteria
var _geojsonIn;
// geojson of features outside filter criteria
var _geojsonOut = null;
// last visCriteria
var _visCriteria = null;

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
      _geojson = window.geojson;
      const splitGeojson = splitGeojsonByCriteria(geojson, e.detail);
      _geojsonIn = splitGeojson.geojsonIn
      _geojsonOut = splitGeojson.geojsonOut
      if (_visCriteria === null) {
        geojsonLayers = [{
          geojson: _geojsonIn,
          name: 'inFilter',
          filterStatus: 'Meets Filter Criteria',
          linePaint: linePaintIn,
          fillPaint: fillPaintIn
        }];
      } else {
        geojsonLayers = buildGeojsonLayerArray(_geojsonIn, _visCriteria.field.value, _visCriteria.classes, _visCriteria.palette, _visCriteria.unitFormatter);
      }
      const updateCount = new CustomEvent('UPDATE_FILTER_SECTION', {
        'detail': {
          numFeaturesInFilter: _geojsonIn.features.length,
          numFeaturesTotal: _geojson.features.length
        }
      });
      document.dispatchEvent(updateCount);
      window.activeFeatureCount = _geojsonIn.features.length;
      break;
    case 'VISUALIZE':
      if (_geojsonIn === undefined) {
        _geojsonIn = window.geojson;
      }
      _visCriteria = e.detail;
      geojsonLayers = buildGeojsonLayerArray(_geojsonIn, _visCriteria.field.value, _visCriteria.classes, _visCriteria.palette, _visCriteria.unitFormatter);
      break;
    default:
      break;
  }
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
  const legendDescription = _visCriteria === null ? 'NULL' : _visCriteria.field.label;
  const legendData = convertGJLayersToLegendData(geojsonLayers, legendDescription);
  const updateLegend = new CustomEvent('UPDATE_LEGEND', {
    'detail': legendData
  });
  document.dispatchEvent(updateLegend);
}