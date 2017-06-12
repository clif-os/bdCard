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
import { fieldUnitAndRangeHandler } from '../components/sidebar/analysisPane/analysisUtils.jsx';
import gjPropsMetadata from '../data/jchs-boston-md.json';
// need an external key since props may be skipped
export const buildPropTable = props => {
  var key = 0
  const propTableRows = Object.keys(props).reduce((acc, prop, i, arr) => {
    if (skipProps.indexOf(prop) > -1){
      return acc;
    }
    key ++;
    let label;
    let value;
    if (gjPropsMetadata[prop] !== undefined){
      label = gjPropsMetadata[prop].description;
      let { unitFormatter } = fieldUnitAndRangeHandler(prop, gjPropsMetadata);
      value = unitFormatter(props[prop]);
    } else {
      if (prop in translations){
        label = translations[prop];
      } else {
        label = prop;
        value = props[prop];
      }
    }
    // every other row is dark, and give the final row a unique classname in order to remove its border
    const rowClass = key % 2 ? 'tr-light' : 'tr-dark';
    const rowId = (i + 1) === arr.length ? 'tr-final' : `tr-${key}`;
    const row = 
    (`
      <tr class=${rowClass} id=${rowId}>
        <td class='td-property'>
          <span class='span-property'>${toTitleCase(label)}</span>
        </td>
        <td class='td-value'>
          <span class='span-value'>${value}</span>
        </td>
      </tr>
    `);
    acc += row;
    return acc;
  }, ``);
  return `<table>${propTableRows}</table>`
}
import { numberWithCommas } from '../utils/generalUtils.jsx';
export const buildPropDisplay = (propsToShow, props) => {
  const propRows = Object.keys(propsToShow).reduce((acc, prop) => {
    let label = propsToShow[prop];
    let value;
    let propType = ``;
    if (prop in window.activeVisFields){
      propType += `<span class="fa fa-paint-brush propIcon"></span>`
    }
    if (prop in window.activeFiltFields){
      propType += `<span class="fa fa-filter propIcon"></span>`
    }
    if (gjPropsMetadata[prop] === undefined){
      if (isNaN(props[prop])){
        value = props[prop];
      } else{
        value = numberWithCommas(props[prop]);
      }      
    } else{
      let { unitFormatter } = fieldUnitAndRangeHandler(prop, gjPropsMetadata);
      value = unitFormatter(props[prop]);
    }
    const row = (`
      <div class="selectionProps-row">
        <span class="propDisplay-label propDisplay-text">${label}</span>  :  <span class="propDisplay-value propDisplay-text">${value}</span>${propType}
      </div>
    `);
    acc += row;
    return acc;
  }, ``);
  return `<div class="selectionProps">${propRows}</div>`
}
export const buildPopupHTMLFromFeature = (feature, selectionPaint) => {
  const props = feature.properties;
  const propDisplay = buildPropDisplay(window.activeFields, props);
  const propTable = buildPropTable(props);
  const squareFill = ('fill-color' in selectionPaint) ? `${selectionPaint['fill-color']}` : `${selectionPaint['line-color']}`
  // setting to 0.6 for now since the line and fill colors can be different;
  const squareOpacity = 0.6
  const html = 
  (`
    <div class="selection">
      <div class='selectionTitle-container'>
        <span class="selectionTitle">
          ${props["NAME_1"]}` +
          (props.neighborhood === 0 ? ' ' : `: ${props.neighborhood} `) + 
          `<span class="selectionSubtitle">(${props["NAMELSAD"]})</span>
          <span class='fa fa-square' style="color:${squareFill};opacity:${squareOpacity}"></span>
        </span>
      </div>
      <div class="propDisplayContainer" >
        ${propDisplay}
      </div>` +
      (Object.keys(window.activeFields).length > 0 ? `<div class="selectionTitle-underline"></div>` : '')
      + `<div class="tableContainer">
        ${propTable}
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
