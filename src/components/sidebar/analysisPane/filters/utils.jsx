// const fakeYears=[
//   {value: '1990', label: '1990'},
//   {value: '2000', label: '2000'},
//   {value: '2010', label: '2010'},
//   {value: '2014', label: '2014'}
// ];
export const convertPropsMetadataToDrodownObject = (metadata) => {
  return Object.keys(metadata).map(prop => {
    return {
      value: prop,
      label: metadata[prop].description
    }
  })
}

import { dollarFormatter, dollarUnformatter, 
         percentFormatter, percentUnformatter, returnVal } from '../../../../utils/generalUtils.jsx';

export const fieldUnitAndRangeHandler = (field, propsMd) => {
  const units = propsMd[field].units;
  let min = propsMd[field].range.min;
  let max = propsMd[field].range.max;
  let unitFormatter, unitUnformatter;
  if (units === 'usd') {
    unitFormatter = dollarFormatter;
    unitUnformatter = dollarUnformatter;
  } else if (units === 'decile' || units === 'number') {
    unitFormatter = returnVal;
    unitUnformatter = returnVal;
  } else if (units === 'percent') {
    // the percent data is formatted inconsistently (sometimes as a share of 1, others as a regular percent of 100)
    // later on the data should be tranformed to have a consistent percent format
    if (min < 1 && max <= 1) {
      min = min * 100;
      max = max * 100;
    }
    unitFormatter = percentFormatter;
    unitUnformatter = percentUnformatter;
  }
  // math floor and ceil are use to straddle either side of the smallest and largest values without truncating the range
  return {
    min: Math.floor(min),
    max: Math.ceil(max),
    units: units,
    unitFormatter: unitFormatter,
    unitUnformatter: unitUnformatter
  }
}