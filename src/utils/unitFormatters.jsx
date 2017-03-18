export const choseFormatter = (units) => {
  switch(units){
    case 'usd':
      return {
        unitFormatter: dollarFormatter,
        unitUnformatter: dollarUnformatter
      };
    case 'decile' || 'number':
      return {
        unitFormatter: returnVal,
        unitUnformatter: returnVal
      }
    case 'percent':
      return {
        unitFormatter: percentFormatter,
        unitUnformatter: percentUnformatter
      }
    default:
      return null;
  }
}

const numberWithCommas = (x) => {
  return x
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const dollarFormatter = v => {
  v = v.toString();
  if (v.includes('.')) {
    v = v.split('.')
    return '$' + numberWithCommas(v[0]) + '.' + v[1];
  } else {
    return '$' + numberWithCommas(v);
  }
}

const dollarUnformatter = numishString => {
  return numishString
    .toString()
    .replace(',', '')
    .replace('$', '');
}

const percentFormatter = v => {
  return v.toString() + '%';
}

const percentUnformatter = numishString => {
  return numishString
    .toString()
    .replace('%', '')
}

const returnVal = val => {
  return val;
}