export const convertPropsMetadataToDrodownObject = (metadata) => {
  const dropdownPropRegistry = {};
  const yearDropdownLookups = {};
  const fieldDropdowns = [];
  Object.keys(metadata).forEach(prop => {
    const description = metadata[prop].description;
    const descWords = description.split(' ');
    const fieldLabel = metadata[prop].descriptionShort;
    const fieldValue = metadata[prop].descriptionKey;
    let yearLabel, yearValue;
    if (description.includes(' to ')){
      // handle range of years
      const index = descWords.indexOf('to');
      const year1 = descWords[index-1];
      const year2 = descWords[index+1];
      yearLabel = year1 + '-' + year2;
      yearValue = year1 + year2;
    } else {
      // handle single year
      const index = descWords.indexOf('in');
      yearLabel = descWords[index+1];
      yearValue = yearLabel;
    }
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

// this is used to create the submenus
// housing income 
// export const buildCategoricalPropsMDDropDownObjects = (metadata) => {
//   var categories = [];
//   const dDObjects = Object.keys(metadata).reduce((acc, prop) => {
//     const dropdownItem = {
//       value: prop,
//       label: metadata[prop].description
//     }
//     const category = metadata[prop].category;
//     category.forEach(category => {
//       if (category in acc){
//         acc[category].push(dropdownItem);
//       } else {
//         acc[category] = [dropdownItem];
//         categories.push(category);
//       }
//     });
//     return acc;
//   }, {});
//   return {
//     categories: categories.sort(),
//     dDObjects: dDObjects
//   };
// };

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