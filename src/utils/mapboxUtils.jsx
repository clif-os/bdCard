export const convertMapboxFeatureToGeoJSON = feature => {
  const geoJSONfeature = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: feature.geometry,
      properties: feature.properties
    }]
  };
  return geoJSONfeature;
}

export var geojsonEmpty = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: []
    }
  }]
};

import {
  findMinMaxForField
} from './geojsonUtils.jsx'
const generateStopArray = (minMax, stopCount) => {
  const difference = minMax[1] - minMax[0];
  const stepRange = difference/stopCount;
  const colors = ['red', 'orange', 'yellow', 'green']
  var steps = [];
  for (var i = 0; i < stopCount; i++) {
    const stepNum = minMax[0] + (i * stepRange)
    const color = colors[i]
    steps.push([stepNum, color])
  }
  return steps
}

export const generateChoroplethFillStyle = (geojson, field, stopCount) => {
  const minMax = findMinMaxForField(geojson, field);
  const colorStops = generateStopArray(minMax, stopCount);

  const fillStyle =  {
                property: field,
                stops: colorStops
              }
  return fillStyle;
}