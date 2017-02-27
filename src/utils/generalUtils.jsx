export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const  dollarFormatter = v => {
  return '$' + numberWithCommas(v);
}

export const dollarUnformatter = numishString => {
  return numishString.toString().replace(',', '').replace('$', '');
}

export const percentFormatter = v => {
  return v.toString() + '%';
}

export const percentUnformatter = numishString => {
  return numishString.toString().replace('%', '')
}

export const returnVal = val => {
  return val;
}

export const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
