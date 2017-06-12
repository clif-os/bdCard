const subwords = ['to', 'in', 'of'];
// needs to be changed to respect '/' as a space
export const toTitleCase = (str, avoidSubwords) => {
  if (avoidSubwords === undefined){
    avoidSubwords = true
  };
  return str.replace(/\w\S*/g, function (txt) {
    return subwords.indexOf(txt) > -1
      ? txt
      : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export const numberWithCommas = (x) => {
  return x
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const dollarFormatter = v => {
  v = v.toString();
  if (v.includes('.')) {
    v = v.split('.')
    return '$' + numberWithCommas(v[0]) + '.' + v[1];
  } else {
    return '$' + numberWithCommas(v);
  }
}

export const dollarUnformatter = numishString => {
  return numishString
    .toString()
    .replace(',', '')
    .replace('$', '');
}

export const percentFormatter = v => {
  return v.toString() + '%';
}

export const percentUnformatter = numishString => {
  return numishString
    .toString()
    .replace('%', '')
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
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const isEquivalent = (a, b) => {
    // Create arrays of property names
    var aProps = Object.keys(a);
    var bProps = Object.keys(b);
    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    // If we made it this far, objects
    // are considered equivalent
    return true;
}