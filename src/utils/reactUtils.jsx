export const dollarFormatter = num => {
  var fNum = String(num);
  if (fNum.includes('.')) {
    const numSides = fNum.split('.');
    if (numSides[1].length === 0) {
      fNum += '.00';
    } else if (numSides[1].length === 1) {
      fNum += '0'
    }
  } else {
    fNum += '.00';
  }
  fNum = '$' + fNum;
  return fNum;
}