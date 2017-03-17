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
        max: lyr.geojson.properties === undefined ? null : lyr.geojson.properties.max,
        layerFeatureCount: lyr.geojson.features.length,
        layerHasFeatures: (lyr.geojson.features.length > 0),
        layerName: lyr.name
      });
    }
    return acc;
  }, []);
  return legendData;
}
