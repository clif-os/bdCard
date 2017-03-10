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

// these specifications need to be taken into account during the data processing eventuallty
const skipProps = [
  'OBJECTID', 'NAME', 'NAMELSAD', 'MTFCC', 'ALAND', 'AWATER', 'INTPTLAT', 'INTPTLON', 'Shape_Leng',
  'Shape_Area', 'Geo_SUMLEV', 'Geo_FILEID', 'Geo_LOGRECNO'
];
const translations = {
  NAME_1: 'City'
};
// important props to top the list:
// income, rent, homeval, home ownership rate
import { toTitleCase } from '../utils/generalUtils.jsx';
import gjPropsMetadata from '../data/jchs-boston-md.json';
// need an external key since props may be skipped
var key = 0
export const buildPopupHTMLFromFeature = feature => {
  const props = feature.properties;
  const tableRows = Object.keys(props).reduce((acc, prop, i, arr) => {
    if (skipProps.indexOf(prop) > -1){
      return acc;
    }
    key ++;
    let label;
    if (gjPropsMetadata[prop] !== undefined){
      label = gjPropsMetadata[prop].description;
    } else {
      if (prop in translations){
        label = translations[prop];
      } else {
        label = prop;
      }
    }
    // every other row is dark, and give the final row a unique classname in order to remove its border
    const rowClass = key % 2 ? 'tr-light' : 'tr-dark';
    const rowId = key === arr.length ? 'tr-final' : `tr-${key}`;
    const row = 
    (`
      <tr class=${rowClass} id=${rowId}>
        <td class='td-property'>
          <span class='span-property'>${toTitleCase(label)}</span>
        </td>
        <td class='td-value'>
          <span class='span-value'>${props[prop]}</span>
        </td>
      </tr>
    `);
    acc += row;
    return acc;
  }, ``);
  
  const html = 
  (`
    <div class="selection">
      <span class="selectionTitle">${props["NAME_1"]} <span class="selectionSubtitle">(${props["NAMELSAD"]})</span></span>
      <div class="tableContainer">
        <table>${tableRows}</table>
      </div>
    </div>
  `)
  return html;
}

export const colorLuminance = (hex, lum) => {
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

export const isTooLightYIQ = hexcolor => {
  var r = parseInt(hexcolor.substr(0,2),16);
  var g = parseInt(hexcolor.substr(2,2),16);
  var b = parseInt(hexcolor.substr(4,2),16);
  var yiq = ((r*299)+(g*587)+(b*114))/1000;
  return yiq >= 200;
}
