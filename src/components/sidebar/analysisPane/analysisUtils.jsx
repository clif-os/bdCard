export const convertPropsMetadataToDrodownObject = (metadata) => {
  return Object.keys(metadata).map(prop => {
    return {
      value: prop,
      label: metadata[prop].description
    }
  })
}

import {
  dollarFormatter,
  dollarUnformatter,
  percentFormatter,
  percentUnformatter,
  returnVal
} from '../../../utils/generalUtils.jsx';

export const fieldUnitAndRangeHandler = (field, propsMd) => {
  const units = propsMd[field].units;
  let min = propsMd[field].range.min;
  let max = propsMd[field].range.max;
  let unitFormatter, unitUnformatter;
  switch(units){
    case 'usd':
      unitFormatter = dollarFormatter;
      unitUnformatter = dollarUnformatter;
      break;
    case 'decile':
      unitFormatter = returnVal;
      unitUnformatter = returnVal;
      break;
    case  'number':
      unitFormatter = returnVal;
      unitUnformatter = returnVal;
      break;
    case 'percent':
      unitFormatter = percentFormatter;
      unitUnformatter = percentUnformatter;
      break;
    default:
      break;
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

export const isSubRange = (range, selectedRange) => {
  if (selectedRange[0] > range[0] || selectedRange[1] < range[1]){
    return true;
  } else if (selectedRange[0] === range[0] || selectedRange[1] === range[1]) {
    return false
  }
}

export const validateRangeInputValue = (input, rangeClass, range, selectedRange) => {
  if (isNaN(input)){
    if (rangeClass === 'minimum'){
      return selectedRange[0];
    } else if (rangeClass === 'maximum'){
      return selectedRange[1];
    }
  } else {
    var inp = parseInt(input);
    if (rangeClass === 'minimum'){
      if (inp >= range[0] && inp <= selectedRange[1]){
        return inp;
      } 
      if (inp < range[0]) {
        return range[0];
      } 
      if (inp > selectedRange[1]){
        return selectedRange[1];
      }
    } else if (rangeClass === 'maximum'){
      if (inp <= range[1] && inp >= selectedRange[0]){
        return inp;
      }
      if (inp > range[1]){
        return range[1];
      }
      if (inp < selectedRange[0]){
        return selectedRange[0];
      }
    }
  }
}