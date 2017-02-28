import { linePaintIn, fillPaintIn, linePaintOut, fillPaintOut,
         generatePaintArray, buildGeojsonLayerArray } from '../mapbox/geojsonLayerUtils.jsx';

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
      if (_visCriteria === null){
        geojsonLayers = [
          {
            geojson: _geojsonIn,
            name: 'inFilter',
            description: 'Meet Filter Criteria',
            linePaint: linePaintIn,
            fillPaint: fillPaintIn
          }
        ];
      } else {
        const paintArray = generatePaintArray(_visCriteria.classes, _visCriteria.palette);
        const classifiedGJArray = splitGeojsonByFieldAndClasses(_geojsonIn, _visCriteria.field.value, _visCriteria.classes);
        geojsonLayers = buildGeojsonLayerArray(classifiedGJArray, paintArray, _visCriteria.field.value);
      }
      const evt2 = new CustomEvent('UPDATE_FILTER_SECTION', {'detail': {
                                        numFeaturesInFilter: _geojsonIn.features.length,
                                        numFeaturesTotal: _geojson.features.length
                                      }
                                    }
                                  );
      document.dispatchEvent(evt2);
      window.activeFeatureCount = _geojsonIn.features.length;
      break;
    case 'VISUALIZE':
      if (_geojsonIn === undefined){
        _geojsonIn = window.geojson;
      }
      _visCriteria = e.detail;
      geojsonLayers = buildGeojsonLayerArray(_geojsonIn,  _visCriteria.field.value, _visCriteria.classes, _visCriteria.palette);
      break;
    default:
      break;
  }
  // push in the layers not caught by the filter
  geojsonLayers.push(
    {
      geojson: _geojsonOut,
      name: 'outFilter',
      description: 'Do Not Meet Filter Criteria',
      linePaint: linePaintOut,
      fillPaint: fillPaintOut
    }
  )
  const evt1 = new CustomEvent('DRAW_NEW_GJ', {'detail': geojsonLayers});
  document.dispatchEvent(evt1);
}