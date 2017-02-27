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

export const buildPopupHTMLFromFeature = feature => {
  const props = feature.properties;
  const tableRows = Object.keys(props).reduce((acc,val, i, arr) => {
    const key = i + 1;
    // every other row is dark, and give the final row a unique classname in order to remove its border
    const rowClass = key % 2 ? 'tr-light' : 'tr-dark';
    const rowId = key === arr.length ? 'tr-final' : `tr-${key}`;
    const row = 
    (`
      <tr class=${rowClass} id=${rowId}>
        <td class='td-property'>
          <span class='span-property'>${val}</span>
        </td>
        <td class='td-value'>
          <span class='span-value'>${props[val]}</span>
        </td>
      </tr>
    `);
    acc += row;
    return acc;
  }, ``);
  
  const html = 
  (`
    <div class="selection">
      <span class="selectionTitle">${props["NAMELSAD"]}</span>
      <div class="tableContainer">
        <table>${tableRows}</table>
      </div>
    </div>
  `)
  return html;
}