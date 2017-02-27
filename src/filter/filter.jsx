import { linePaintIn, fillPaintIn, linePaintOut, fillPaintOut,
         generatePaintArray, buildGeojsonLayerArray } from '../mapbox/geojsonLayerUtils.jsx';

import { splitGeojsonByCriteria, splitGeojsonByFieldAndClasses } from './filterUtils.jsx';

const actions = ['FILTER', 'VISUALIZE'];

// all features
var _geojson;
// geojson of features within filter criteria
var _geojsonIn;
// geojson of features outside filter criteria
var _geojsonOut;

export const dashboardListener = () => {
  actions.forEach(action => {
    document.addEventListener(action, actionHandler.bind(this));
  });
};

const actionHandler = e => {
  const type = e['type'];
  switch (type) {
    case 'FILTER':
      _geojson = window.geojson;
      const splitGeojson = splitGeojsonByCriteria(geojson, e.detail);
      _geojsonIn = splitGeojson.geojsonIn
      _geojsonOut = splitGeojson.geojsonOut
      const geojsons = [
        {
          geojson: _geojsonIn,
          name: 'inFilter',
          linePaint: linePaintIn,
          fillPaint: fillPaintIn
        },
        {
          geojson: _geojsonOut,
          name: 'outFilter',
          linePaint: linePaintOut,
          fillPaint: fillPaintOut
        }
      ];
      const evt1 = new CustomEvent('DRAW_NEW_GJ', {'detail': geojsons});
      document.dispatchEvent(evt1);
      const activeFeatureCount = splitGeojson.geojsonIn.features.length;
      const evt2 = new CustomEvent('UPDATE_FILTER_SECTION', {'detail': {
                                        numFeaturesInFilter: activeFeatureCount,
                                        numFeaturesTotal: _geojson.features.length
                                      }
                                    }
                                  );
      document.dispatchEvent(evt2);
      window.activeFeatureCount = activeFeatureCount
      break;
    case 'VISUALIZE':
      if (_geojsonIn === undefined){
        _geojsonIn = window.geojson;
      }
      const field = e.detail.field.value
      const paintArray = generatePaintArray(e.detail.classes, e.detail.palette);
      const classifiedGJArray = splitGeojsonByFieldAndClasses(_geojsonIn, field, e.detail.classes);
      const geojsonLayers = buildGeojsonLayerArray(classifiedGJArray, paintArray, field);
      const evt3 = new CustomEvent('DRAW_NEW_GJ', {'detail': geojsonLayers});
      document.dispatchEvent(evt3);
      break;
    default:
      break;
  }
}