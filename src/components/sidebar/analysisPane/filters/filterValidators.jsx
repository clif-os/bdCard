// // dummy validator
// export const validateTitle = title => {
//   return title.length > 0 ? true : false;
// }

export const isSubRange = (range, selectedRange) => {
  if (selectedRange[0] > range[0] || selectedRange[1] < range[1]){
    return true;
  } else if (selectedRange[0] === range[0] || selectedRange[1] === range[1]) {
    return false
  }
}

export const validateRangeInputValue = (input, rangeClass, range) => {
  if (isNaN(input)){
    return false;
  } else {
    var inp = parseInt(input);
    if (rangeClass === 'minimum'){
      if (inp >= range[0]){
        return true;
      } else {
        return false;
      }
    } else if (rangeClass === 'maximum'){
      if (inp <= range[1]){
        return true;
      } else {
        return false;
      }
    }
  }
}
