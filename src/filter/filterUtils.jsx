import gjPropsMetadata from '../data/jchs-boston-md.json';

// it might be best to change this to a looping method which can return immediately
const featureMeetsCriteria = (feature, criteria) => {
  var criteriaMet = true;
  criteria.forEach(crit => {
    const value = feature.properties[crit.field];
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

const generateGeojsonShells = (splitRanges, field, unitFormatter) => {
  // unit converter needs to end up here
  var shells = [];
  splitRanges.forEach(range => {
    shells.push({
      type: 'FeatureCollection',
      properties: {
        field: field,
        fieldDescription: gjPropsMetadata[field].description,
        range: range,
        min: `${unitFormatter(range[0])}`,
        max: `${unitFormatter(range[1])}`
      },
      features: []
    });
  })
  shells.push({
    type: 'FeatureCollection',
    properties: {
      field: field,
      fieldDescription: gjPropsMetadata[field].description,
      range: 'null values and non-numbers',
      min: null,
      max: null
    },
    features: []
  });
  return shells;
}

const splitGeojsonByRanges = (geojson, field, splitRanges, unitFormatter) => {
  const geojsonShells = generateGeojsonShells(splitRanges, field, unitFormatter);
  return geojson.features.reduce((acc, feature) => {
    const val = feature.properties[field];
    let assigned = false;
    if (isNaN(val) || val === null) {
      // handle non numbers and nulls, push them to the final shell, which is for nulls
      acc[acc.length - 1].features.push(feature);
      assigned = true;
    } else if (val === splitRanges[splitRanges.length - 1][1]) {
      // handle the max value differently since most bins are >= min && < max (final bin is >=min && <=max in order to include the max)
      acc[splitRanges.length - 1].features.push(feature);
      assigned = true;
    } else {
      splitRanges.forEach((range, i) => {
        if (val >= range[0] && val < range[1]) {
          acc[i].features.push(feature);
          assigned = true;
        }
      });
    };
    if (!assigned) console.error('val not assigned', val);
    return acc;
  }, geojsonShells);
}

export const splitRangeByClasses = (range, classes) => {
  let min, max
  if ( Object.prototype.toString.call( range ) === '[object Array]' ) {
    min = Math.floor(range[0]);
    max = Math.ceil(range[1]);
  } else {
    min = Math.floor(range.min);
    max = Math.ceil(range.max);
  }
  const classLength = Math.round((max - min) / classes);
  var minVal = min;
  var splitRanges = [];
  for (var i = 0; i < classes; i++) {
    let maxVal;
    if (i === (classes - 1)) {
      maxVal = max;
    } else {
      // dunno why i even have to round here someone plz explain math to me
      maxVal = Math.round((minVal + classLength) * 100) / 100;
    }
    splitRanges.push([minVal, maxVal]);
    minVal = maxVal;
  };
  return splitRanges;
}

import { choseFormatter } from '../utils/unitFormatters.jsx';
export const splitGeojsonByFieldAndClasses = (geojson, field, ranges) => {
  // const range = gjPropsMetadata[field].range;
  // const splitRanges = splitRangeByClasses(range, classes);
  const { unitFormatter } = choseFormatter(gjPropsMetadata[field].units);
  return splitGeojsonByRanges(geojson, field, ranges, unitFormatter);
}