// // dummy validator
// export const validateTitle = title => {
//   return title.length > 0 ? true : false;
// }

export const validateRange = (range, selectedRange) => {
  if (selectedRange[0] > range[0] || selectedRange[1] < range[1]){
    return true;
  } else if (selectedRange[0] === range[0] || selectedRange[1] === range[1]) {
    return false
  }
}