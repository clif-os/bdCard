export const splitRangeByClassesWithStepVals = (range, classes, stepVal) => {
  let min, max
  if ( Object.prototype.toString.call( range ) === '[object Array]' ) {
    min = Math.floor(range[0]);
    max = Math.ceil(range[1]);
  } else {
    min = Math.floor(range.min);
    max = Math.ceil(range.max);
  }
  console.log({min}, {max});
  
  const classLength = Math.round((max - min) / classes);

  var minVal = min;
  var splitRanges = [];
  for (var i = 0; i < classes; i++) {
    let maxVal;
    if (i === (classes - 1)) {
      maxVal = max;
    } else {
      // dunno why i even have to round here someone plz explain math to me
      maxVal = Math.round((minVal + classLength) * 100) / 100;
    }
    splitRanges.push([
      (Math.round(minVal / stepVal) * stepVal), 
      (Math.round(maxVal / stepVal) * stepVal)
    ]);
    minVal = maxVal;
  };
  console.log({splitRanges});
  return splitRanges;
}

export const splitsToSliderValues = splits => {
  return splits.reduce((acc, split) => {
    split.forEach(value => {
      if (acc.length === 0 || acc.indexOf(value) === -1){
        acc.push(value);
      }
    });
    return acc;
  }, []);
}

export const sliderValuesToSplits = sliderVals => {
  return sliderVals.reduce((acc, val, i) => {
    if (i < sliderVals.length - 1){
      acc.push([val, sliderVals[i + 1]]);
    };
    return acc;
  }, []);
}

export const classes = [
  {value: 2, label: '2'},
  {value: 3, label: '3'},
  {value: 4, label: '4'},
  {value: 5, label: '5'},
  {value: 6, label: '6'},
  {value: 7, label: '7'},
  {value: 8, label: '8'},
  {value: 9, label: '9'},
  {value: 10, label: '10'},
];

export const palettes = [
  {value: 'red to green', label: 'Red to Green'},
  {value: 'green to red', label: 'Green to Red'},
  {value: 'increasing green', label: 'Increasing Green'},
  {value: 'decreasing green', label: 'Decreasing Green'},
  {value: 'increasing red', label: 'Increasing Red'},
  {value: 'decreasing red', label: 'Decreasing Red'},
  {value: 'increasing pink', label: 'Increasing Pink'},
  {value: 'decreasing pink', label: 'Decreasing Pink'},
  {value: 'increasing blue', label: 'Increasing Blue'},
  {value: 'decreasing blue', label: 'Decreasing Blue'}
];