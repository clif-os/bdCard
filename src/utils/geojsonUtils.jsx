export const convertGeojsonToLookup = geojson => {
  var geojsonLookupByID = {}
  geojson.features.forEach(feature => {
    geojsonLookupByID[feature.properties.GEOID] = feature;
  });
  return geojsonLookupByID
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

export const findMinMaxForField = (geojson, field) => {
  console.log(geojson, field);
  var minMax = [null, null];
  geojson.features.forEach(feature => {
    var relFields = []
    Object.keys(feature.properties).forEach(property => {
      if (property.startsWith(field)) {
        relFields.push(property);
      }
    });
    relFields.forEach(relField => {
      const value = feature.properties[relField]
      if (value < minMax[0] || minMax [0] === null){
        minMax[0] = value
      }
      if (value > minMax[1] || minMax [1] === null){
        minMax[1] = value
      }
    })
  })
  return minMax
}