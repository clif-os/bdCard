import { linePaintIn, fillPaintIn, linePaintOut, fillPaintOut,
         generatePaintArray } from '../mapbox/geojsonLayerUtils.jsx';

const actions = ['FILTER', 'VISUALIZE'];

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


// it might be best to change this to a looping method which can return immediately
const featureMeetsCriteria = (feature, criteria) => {
  var criteriaMet = true;
  criteria.forEach(crit => {
    const value = feature.properties[crit.field.value];
    if (value < crit.range[0] || value > crit.range[1]) {
      criteriaMet = false;
    }
  });
  return criteriaMet;
}

const splitGeojsonByCriteria = (geojson, criteria) => {
  return geojson.features.reduce((acc, feat) => {
    featureMeetsCriteria(feat, criteria) ?
      acc.geojsonIn.features.push(feat) :
      acc.geojsonOut.features.push(feat);
    return acc;
  }, {
    geojsonIn: {
      type: 'FeatureCollection',
      features: []
    },
    geojsonOut: {
      type: 'FeatureCollection',
      features: []
    }
  });
}

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
      const paintArray = generatePaintArray(e.detail.classes, e.detail.palette);
      console.log(paintArray);
      break;
    default:
      break;
  }
}