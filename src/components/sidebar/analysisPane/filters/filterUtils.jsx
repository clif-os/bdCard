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
    } else {
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