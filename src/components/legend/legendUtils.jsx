export const convertGJLayersToLegendData = (gjLayers, description) => {
  var legendData = {
    description: description
  }
  legendData.nodes = gjLayers.reduce((acc, lyr, i) => {
    // line and fill color are the same, but different opacities
    if (lyr.geojson !== null) {
      acc.push({
        filterStatus: lyr.filterStatus,
        color: lyr.fillPaint['fill-color'],
        description: lyr.geojson.properties === undefined ? lyr.filterStatus : lyr.geojson.properties.fieldDescription,
        field: lyr.geojson.properties === undefined ? null : lyr.geojson.properties.field,
        range: lyr.geojson.properties === undefined ? null : lyr.geojson.properties.range,
        min: lyr.geojson.properties === undefined ? null : lyr.geojson.properties.min,
        max: lyr.geojson.properties === undefined ? null : lyr.geojson.properties.max
      });
    }
    return acc;
  }, []);
  return legendData;
}

// {
//       geojson: _geojsonOut,
//       name: 'outFilter',
//       description: 'Does Not Meet Filter Criteria',
//       linePaint: linePaintOut,
//       fillPaint: fillPaintOut
//     }

//     return {
//     linePaint: {
//       'line-width': {
//         'stops': [
//           [10, .75],
//           [11, 1],
//           [12, 1.5],
//           [13, 1.75],
//           [14, 2]
//         ]
//       },
//       'line-opacity': 0.8,
//       'line-color': color
//     },
//     fillPaint: {
//       'fill-color': color,
//       'fill-opacity': 0.6
//     }
//   }

// shells.push({
//       type: 'FeatureCollection',
//       properties: {
//         field: field,
//         fieldDescription: gjPropsMetadata[field].description,
//         range: range,
//         min: `${unitFormatter(range[0])}`,
//         max: `${unitFormatter(range[1])}`
//       },
//       features: []
//     });
//   })
//   shells.push({
//     type: 'FeatureCollection',
//     properties: {
//       field: field,
//       fieldDescription: gjPropsMetadata[field].description,
//       range: 'null values and non-numbers',
//       min: null,
//       max: null
//     },
//     features: []
//   });