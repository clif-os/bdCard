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

import {
  dollarFormatter,
  dollarUnformatter,
  percentFormatter,
  percentUnformatter,
  returnVal
} from '../../../../utils/generalUtils.jsx';

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

// const defaultFilterMemory = {
//   titleValue: '',
//   filterActive: true,
//   fieldValue: defaultFieldVal,
//   filterValid: false,
//   range: [min, max],
//   selectedRange: [min, max],
//   units: units,
//   unitFormatter: unitFormatter,
//   unitUnformatter: unitUnformatter,
//   rangeMinInputActive: false,
//   rangeMaxInputActive: false,
//   rangeInputValue: ''
// }

export const constructFilterEventData = (filterSettings) => {
  return Object.keys(filterSettings).reduce((acc, key) => {
    if ((filterSettings[key].selectedRange[0] === filterSettings[key].range[0] 
        && filterSettings[key].selectedRange[1] === filterSettings[key].range[1])
        || !filterSettings[key].filterActive){
      return acc;
    } else{
      acc.push({
        key: key,
        field: filterSettings[key].fieldValue,
        range: filterSettings[key].selectedRange
      });
    }
    return acc;
  }, []);
}

// currently unable to 'swap' in and out filters, so no need to check for that
export const filterEventsAreDifferent = (last, next) => {
  let differenceExists
  if (last.length !== next.length) {
    return true;
  } else if (last.length === 0 && next.length === 0){
    return false;
  } else {
    last.forEach(lastFiltSetting => {
      next.forEach(nextFiltSetting => {
        if (lastFiltSetting.key === nextFiltSetting.key){
          if (lastFiltSetting.field !== nextFiltSetting.field 
              || lastFiltSetting.range[0] !== nextFiltSetting.range[0]
              || lastFiltSetting.range[1] !== nextFiltSetting.range[1]){
                differenceExists = true
              }
        }
      });
    });
  }
  return differenceExists;
}