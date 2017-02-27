import gjPropsMetadata from '../data/boston_props_metadata.json';

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

export const splitGeojsonByCriteria = (geojson, criteria) => {
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

const generateGeojsonShells = num => {
  var shells = [];
  // create an extra shell for null values
  const numWithNull = num + 1
  for (var i = 0; i < numWithNull; i++){
    shells.push(
      {
        type: 'FeatureCollection',
        features: []
      }
    );
  }
  return shells;
}

const splitGeojsonByRanges = (geojson, field, splitRanges) => {
  const geojsonShells = generateGeojsonShells(splitRanges.length);
  return geojson.features.reduce((acc, feature) => {
    const val = feature.properties[field];
    var assigned = false;
    if (isNaN(val) || val === null){
      // handle non numbers and nulls, push them to the final shell, which is for nulls
      acc[acc.length - 1].features.push(feature);
      assigned = true;
    } else if (val === splitRanges[splitRanges.length - 1][1]){
      // handle the max value differently since most bins are >= min && < max (final bin is >=min && <=max in order to include the max)
      acc[splitRanges.length - 1].features.push(feature);
      assigned = true;
    } else{
      splitRanges.forEach((range, i) => {
        if (val >= range[0] && val < range[1]){
          acc[i].features.push(feature);
          assigned = true;
        }
      });
    }
    if (!assigned) console.error('val not assigned', val);
    return acc;
  }, geojsonShells);
}

const splitRangeByClasses = (range, classes) => {
  const min = range.min;
  const max = range.max;
  const classLength = Math.round( (max - min) / classes );
  var minVal = min;
  var splitRanges = [];
  for (var i = 0; i < classes; i++){
    let maxVal;
    if (i === (classes - 1)){
      maxVal = max;
    } else {
      maxVal = minVal + classLength;
    }
    splitRanges.push([minVal, maxVal]);
    minVal = maxVal;
  };
  return splitRanges;
}

export const splitGeojsonByFieldAndClasses = (geojson, field, classes) => {
  const range = gjPropsMetadata[field].range;
  const splitRanges = splitRangeByClasses(range, classes)
  return splitGeojsonByRanges(geojson, field, splitRanges);
}