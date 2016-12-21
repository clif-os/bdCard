export const convertBostonPropsToD3Array = (props, fieldTag) => {
  //it is a good idea to filter the props prior to input, but the function is checking to make sure the desired
  // field matches what is in the props
  console.log("STARTING CONVERSION TO D3 ARRAY");
  var d3Array = [];
  var index = 0
  Object.keys(props).forEach(prop => {
    if (prop.startsWith(fieldTag)){
      var entry = {};
      entry[fieldTag] = parseFloat(props[prop])
      entry.index = index;
      if (prop.indexOf('90')>=0){
        entry.year = '1990';
      } else if (prop.indexOf('00')>=0){
        entry.year = '2000';
      } else if (prop.indexOf('10')>=0){
        entry.year = '2010';
      } else if (prop.indexOf('14')>=0){
        entry.year = '2014';
      }
      d3Array.push(entry);
      index++;
    }
  });
  return d3Array;
}

export const createD3Range = (d3Data, field, bufferFactor) => {
  var minMax = [null, null];
  // find min and max
  d3Data.forEach(item => {
    const value = item[field];
    if (value < minMax[0] || minMax [0] === null){
        minMax[0] = value
      }
      if (value > minMax[1] || minMax [1] === null){
        minMax[1] = value
      }
  });
  // apply bufferFactor onto value range
  const buffer =  Math.ceil((minMax[1] - minMax[0]) * bufferFactor)
  minMax[0] -= buffer
  minMax[1] += buffer
  return minMax
}