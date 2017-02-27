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


// FIGURE OUT WHY THERE ARE VALUES LESS THAN THE MINIMUM DESCRIBED IN THE METADATA
const splitGeojsonByRanges = (geojson, field, splitRanges) => {
  const geojsonShells = generateGeojsonShells(splitRanges.length);
  var countedLength = 0;
  var nonAssignedCount = 0
  const tempSplitGeojson = geojson.features.reduce((acc, feature) => {
    const val = feature.properties[field];
    var valAssigned = false;
    if (isNaN(val) || val === null){
      countedLength++;
      valAssigned = true;
      acc[acc.length - 1].features.push(feature);
      return acc;
    } else if (val === splitRanges[splitRanges.length - 1][1]){
      // handle the max value differently
      acc[splitRanges.length - 1].features.push(feature)
      countedLength++;
      valAssigned = true;
      return acc;
    } else{
      splitRanges.forEach((range, i) => {
        if (val >= range[0] && val < range[1]){
          countedLength++;
          valAssigned = true
          acc[i].features.push(feature);
          return acc;
        }
        // trying to figure out why features are missing currently
      });
    }
    if (!valAssigned){
      console.log('val not assigned', val);
      nonAssignedCount++
    }
    return acc;
  }, geojsonShells)
  const incLength = geojson.features.length;
  console.log('nonAssignedCount', nonAssignedCount);
  console.log('countedLength', countedLength);
  console.log('incLength', incLength);
  return tempSplitGeojson;
}

const splitRangeByClasses = (range, classes) => {
  console.log(range);
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