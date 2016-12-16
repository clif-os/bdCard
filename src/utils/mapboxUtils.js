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