export const convertPropsMetadataToDrodownObject = (metadata) => {
  const dropdownPropRegistry = {};
  const yearDropdownLookups = {};
  const fieldDropdowns = [];
  Object.keys(metadata).forEach(prop => {
    const description = metadata[prop].description;
    const descWords = description.split(' ');
    const fieldLabel = metadata[prop].descriptionShort;
    const fieldValue = metadata[prop].descriptionKey;
    const yearLabel = metadata[prop].year;
    const yearValue = metadata[prop].yearKey
    
    dropdownPropRegistry[fieldValue + yearValue] = prop;
    const yearDropdown = {
      value: yearValue,
      label: yearLabel
    }
    if (fieldValue in yearDropdownLookups){
      yearDropdownLookups[fieldValue].push(yearDropdown);
    } else {
      yearDropdownLookups[fieldValue] = [yearDropdown];
      fieldDropdowns.push(
        { 
          value: fieldValue,
          label: fieldLabel
        }
      )
    }
    
  });
  return {
    fieldDropdowns: fieldDropdowns,
    yearLookups: yearDropdownLookups,
    dropdownPropRegistry: dropdownPropRegistry
  }
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
  let stepVal;
  switch(units){
    case 'usd':
      stepVal = 100;
      unitFormatter = dollarFormatter;
      unitUnformatter = dollarUnformatter;
      break;
    case 'decile':
      stepVal = 1;
      unitFormatter = returnVal;
      unitUnformatter = returnVal;
      break;
    case  'number':
      stepVal = 1;
      unitFormatter = returnVal;
      unitUnformatter = returnVal;
      break;
    case 'percent':
      stepVal = 1;
      unitFormatter = percentFormatter;
      unitUnformatter = percentUnformatter;
      break;
    default:
      break;
  }
  // set max and min of slider equal something reachable by stepVal, but keep min/max separate
  let stepMin = min;
  let stepMax = max;
  if (stepMin % stepVal !== 0){
    stepMin = stepMin - ((stepMin % stepVal) + stepVal);
  }
  if (stepMax % stepVal !== 0){
    stepMax = stepMax + (stepVal - (stepMax % stepVal));
  }
  // math floor and ceil are use to straddle either side of the smallest and largest values without truncating the range
  return {
    min: Math.floor(min),
    max: Math.ceil(max),
    median: propsMd[field].median,
    units: units,
    unitFormatter: unitFormatter,
    unitUnformatter: unitUnformatter,
    stepMax: stepMax,
    stepMin: stepMin,
    stepVal: stepVal
  }
}

export const isSubRange = (range, selectedRange) => {
  if (selectedRange[0] > range[0] || selectedRange[1] < range[1]){
    return true;
  } else if (selectedRange[0] === range[0] || selectedRange[1] === range[1]) {
    return false
  }
}

export const validateAndNormalizeRangeInputValue = (input, rangeClass, range, selectedRange) => {
  if (isNaN(input)){
    if (rangeClass === 'minimum'){
      return selectedRange[0];
    } else if (rangeClass === 'maximum'){
      return selectedRange[1];
    }
  } else {
    var inp = Math.round(input);
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

const buildPropLabel = (setting) => {
  if (Object.keys(setting).length === 0){
    return null;
  }
  const fieldLabel = setting.fieldLabel;
  const yearLabel = setting.yearLabel;
  return fieldLabel + ' ' + yearLabel;
};

export const updateActiveFields = (type, settings) => {
  switch(type){
    case 'filter':
      window.activeFiltFields = {};
      Object.keys(settings).forEach(settingId => {
        const setting = settings[settingId];
        const propLabel = buildPropLabel(setting);
        const selectedProp = setting.selectedProp;
        window.activeFiltFields[selectedProp] = propLabel;
      });
      break;
    case 'passFail':
      window.activeVisFields = {};
      Object.keys(settings).forEach(settingId => {
        const setting = settings[settingId];
        const propLabel = buildPropLabel(setting);
        const selectedProp = setting.selectedProp;
        window.activeVisFields[selectedProp] = propLabel;
      });
      break;
    case 'classes':
      window.activeVisFields = {};
      const propLabel = buildPropLabel(settings);
      const selectedProp = settings.selectedProp;
      window.activeVisFields[selectedProp] = propLabel;
      break;
    default:
      break;
  }
  mergeAllActiveFields();
}

import {
  isEquivalent
} from '../../../utils/generalUtils.jsx';
let oldActivityObjects = [];
const mergeAllActiveFields = () => {
  const activityObjects = [window.activeVisFields, window.activeFiltFields];
  window.activeFields = activityObjects.reduce((acc, activityObject) => {
    Object.keys(activityObject).forEach(field => {
      acc[field] = activityObject[field];
    });
    return acc;
  }, {});
  Object.keys(window.defaultActiveFields).forEach( field => {
    window.activeFields[field] = window.defaultActiveFields[field];
  });
  let equivalent;
  oldActivityObjects.forEach((aObject, i) => {
    if (! isEquivalent(aObject, activityObjects[i])){
      equivalent = false
    }
  });
  if (! equivalent || oldActivityObjects.length === 0) {
    const deselect = new CustomEvent('DESELECT_FEATURE');
    document.dispatchEvent(deselect);
  }
  oldActivityObjects = [Object.assign({}, window.activeVisFields), Object.assign({}, window.activeFiltFields)]
}