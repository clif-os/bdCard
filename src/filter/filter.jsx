import {
  buildPaint,
  buildGeojsonLayerArray
} from '../mapbox/geojsonLayerUtils.jsx';
import {
  convertGJLayersToLegendData
} from '../components/legend/legendUtils.jsx';
import {
  splitGeojsonByCriteria
} from './filterUtils.jsx';

import gjPropsMetadata from '../data/jchs-boston-md.json';

const actions = ['FILTER', 'VISUALIZE_CLASSES', 'VISUALIZE_PASSFAIL', 'VISFILT_PASSFAIL', 'VISFILT_CLASSES'];

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

// this variable is used to inform the filter event to remain unvisualized if false

var _visualization = false;

export const dashboardListener = () => {
  actions.forEach(action => {
    document.addEventListener(action, actionHandler.bind(this));
  });
};

const actionHandler = e => {
  _geojson = window.geojson;
  const type = e['type'];
  let geojsonLayers;
  switch (type) {
    case 'FILTER':
      _filtCriteria = e.detail;
      const splitGeojson = splitGeojsonByCriteria(geojson, _filtCriteria);
      _geojsonIn = splitGeojson.geojsonIn
      _geojsonOut = splitGeojson.geojsonOut
      if (! _visualization || (_visCriteria === null && _passFailCriteria === null)) {
        const {linePaint, fillPaint} = buildPaint('defaultPass')
        geojsonLayers = [{
          geojson: _geojsonIn,
          name: 'inFilter',
          filterStatus: 'Meets Filter Criteria',
          linePaint: linePaint,
          fillPaint: fillPaint
        }];
      } else {
        if (_activeVisualizer === 'passFail'){
          geojsonLayers = generatePassFailLayers(_passFailCriteria, _geojsonIn);
        } else if (_activeVisualizer === 'classes'){
          geojsonLayers = buildGeojsonLayerArray(_geojsonIn, _visCriteria.field, _visCriteria.ranges, _visCriteria.palette);
        }
      }
      dispatchFilterEvents(geojsonLayers);
      break;
    case 'VISUALIZE_CLASSES':
    _activeVisualizer = 'classes'
      if (_geojsonIn === undefined) {
        _geojsonIn = window.geojson;
      }
      _visCriteria = e.detail;
      if (_visCriteria.visActive){
        geojsonLayers = buildGeojsonLayerArray(_geojsonIn, _visCriteria.field, _visCriteria.ranges, _visCriteria.palette);
        _visualization = true;
      } else {
        if (! _visualization) break; //?????
        geojsonLayers = unvisualize(_geojsonIn);
      }
      dispatchFilterEvents(geojsonLayers);
      break;
    case 'VISUALIZE_PASSFAIL':
      _activeVisualizer = 'passFail'
      if (_geojsonIn === undefined) {
        _geojsonIn = window.geojson;
      }
      _passFailCriteria = e.detail;
      if (_passFailCriteria.length === 0){
        geojsonLayers = unvisualize(_geojsonIn);
      } else if (_passFailCriteria.length > 0) {
        geojsonLayers = generatePassFailLayers(_passFailCriteria, _geojsonIn);
        _visualization = true;
      }
      dispatchFilterEvents(geojsonLayers, true);
      break;
    case 'VISFILT_PASSFAIL':
      _activeVisualizer = 'passFail'
      _filtCriteria = e.detail.filterEvent;
      const splitGeojson_VF_PF1 = splitGeojsonByCriteria(_geojson, _filtCriteria);
      _geojsonIn = splitGeojson_VF_PF1.geojsonIn
      _geojsonOut = splitGeojson_VF_PF1.geojsonOut
      _passFailCriteria = e.detail.visEvent;
      if (_passFailCriteria.length === 0){
        geojsonLayers = unvisualize(_geojsonIn);
      } else if (_passFailCriteria.length > 0){
        geojsonLayers = generatePassFailLayers(_passFailCriteria, _geojsonIn);
        _visualization = true;
      }
      dispatchFilterEvents(geojsonLayers, true);
      break;
    case 'VISFILT_CLASSES':
      _activeVisualizer = 'classes';
      _filtCriteria = e.detail.filterEvent;
      if (_filtCriteria !== null) {
        const splitGeojson_VF_C1 = splitGeojsonByCriteria(_geojson, _filtCriteria);
        _geojsonIn = splitGeojson_VF_C1.geojsonIn
        _geojsonOut = splitGeojson_VF_C1.geojsonOut
      } else {
        _geojsonIn = _geojson;
      }
      _visCriteria = e.detail.visEvent;
      if (! _visCriteria.visActive){
        geojsonLayers = unvisualize(_geojsonIn);
      } else if (_visCriteria !== null){
        geojsonLayers = buildGeojsonLayerArray(_geojsonIn, _visCriteria.field, _visCriteria.ranges, _visCriteria.palette);
        _visualization = true;
      } else {
        let passPaint = buildPaint('defaultPass');
        geojsonLayers = [{
          geojson: _geojsonIn,
          name: 'inFilter',
          filterStatus: 'Meets Filter Criteria',
          linePaint: passPaint.linePaint,
          fillPaint: passPaint.fillPaint
        }];
      }
      dispatchFilterEvents(geojsonLayers);
      break;
    default:
      break;
  }
}

const dispatchFilterEvents = (geojsonLayers, isPassFailEvent) => {
  // push in the filtered-out layers
  if (_geojsonOut !== null) {
    if (_geojsonOut.features.length > 0) {
      let failPaint = buildPaint('defaultFail');
      geojsonLayers.push({
        geojson: _geojsonOut,
        name: 'outFilter',
        filterStatus: 'Does Not Meet Filter Criteria',
        linePaint: failPaint.linePaint,
        fillPaint: failPaint.fillPaint
      });
    }
  }
  const draw = new CustomEvent('DRAW_NEW_GJ', {
    'detail': geojsonLayers
  });
  document.dispatchEvent(draw);
  const legendDescription = (_visCriteria === null || _visCriteria === [] || isPassFailEvent) ? 'NULL' : gjPropsMetadata[_visCriteria.field].description;
  const legendData = convertGJLayersToLegendData(geojsonLayers, legendDescription);
  const updateLegend = new CustomEvent('UPDATE_LEGEND', {
    'detail': legendData
  });
  document.dispatchEvent(updateLegend);
  window.activeFeatureCount = _geojsonIn.features.length;
  window.geojsonFiltered = Object.assign({}, _geojsonIn);
  const updateCount = new CustomEvent('UPDATE_FILTER_SECTION', {
        'detail': {
          numFeaturesInFilter: _geojsonIn.features.length,
          numFeaturesTotal: _geojson.features.length
        }
      });
  document.dispatchEvent(updateCount);
  window.activeFeatureCount = _geojsonIn.features.length;
}

const generatePassFailLayers = (_passFailCriteria, gj) => {
  const bothCriteria = splitGeojsonByCriteria(gj, _passFailCriteria);
      var _bothCriteriaPass = bothCriteria.geojsonIn
      var _bothCriteriaFail = bothCriteria.geojsonOut
      let passPaint = buildPaint('pass');
      let failPaint = buildPaint('fail');
      if (_passFailCriteria.length === 0 || _passFailCriteria.length === 1){
        return [{
          geojson: _bothCriteriaPass,
          name: 'pass',
          filterStatus: 'Passes Visualization Criteria',
          linePaint: passPaint.linePaint,
          fillPaint: passPaint.fillPaint
        },
        {
          geojson: _bothCriteriaFail,
          name: 'fail',
          filterStatus: 'Fails Visualization Criteria',
          linePaint: failPaint.linePaint,
          fillPaint: failPaint.fillPaint
        }];
      } else if (_passFailCriteria.length === 2){
        const firstCriteria = splitGeojsonByCriteria(_bothCriteriaFail, [_passFailCriteria[0]]);
        var _firstCriteriaPassOnly = firstCriteria.geojsonIn;
        var _firstCriteriaFailOnly = firstCriteria.geojsonOut;
        const secondCriteria = splitGeojsonByCriteria(_firstCriteriaFailOnly, [_passFailCriteria[1]]);
        var _secondCriteriaPassOnly = secondCriteria.geojsonIn;
        var _secondCriteriaFailOnly = secondCriteria.geojsonOut;
        let pass1Paint = buildPaint('passAlt1');
        let pass2Paint = buildPaint('passAlt2');
        return [{
          geojson: _bothCriteriaPass,
          name: 'pass',
          filterStatus: 'Passes Both Visualization Criteria',
          linePaint: passPaint.linePaint,
          fillPaint: passPaint.fillPaint
        },
        {
          geojson: _secondCriteriaFailOnly,
          name: 'fail',
          filterStatus: 'Fails All Visualization Criteria',
          linePaint: failPaint.linePaint,
          fillPaint: failPaint.fillPaint
        },
        {
          geojson: _firstCriteriaPassOnly,
          name: 'firstPass',
          filterStatus: 'Passes First Visualization Criteria Only',
          linePaint: pass1Paint.linePaint,
          fillPaint: pass1Paint.fillPaint
        },
        {
          geojson: _secondCriteriaPassOnly,
          name: 'secondPass',
          filterStatus: 'Passes Second Visualization Criteria Only',
          linePaint: pass2Paint.linePaint,
          fillPaint: pass2Paint.fillPaint
        }];
      }
}

const unvisualize = (gj) => {
  _visCriteria = null;
  _visualization = false;
  let passPaint = buildPaint('defaultPass');
  return [{
      geojson: gj,
      name: 'inFilter',
      filterStatus: 'Meets Filter Criteria',
      linePaint: passPaint.linePaint,
      fillPaint: passPaint.fillPaint
    }];
}