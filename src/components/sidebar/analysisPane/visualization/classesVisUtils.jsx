export const splitRangeByClassesWithStepVals = (range, classes, stepVal) => {
  let min, max
  if ( Object.prototype.toString.call( range ) === '[object Array]' ) {
    min = Math.floor(range[0]);
    max = Math.ceil(range[1]);
  } else {
    min = Math.floor(range.min);
    max = Math.ceil(range.max);
  }
  // console.log({min}, {max});
  
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
  // console.log({splitRanges});
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

export const determineNewSelectedSplitRanges = (selectedSplitRanges, defaultSplits, stepMin, stepMax, stepVal, yearValue, newYearValue) => {
  const slotsAvailable = (stepMax - stepMin) / stepVal;
  const slotsNeeded = selectedSplitRanges.length * 2;
  // the min/max criteria dont seem to be working as expected, but the results of this function are satisfactory for now
  // check the min/max criteria which are the second and third conditions of four necessary to perform settings preservation
  // for the slider
  if (yearValue.length === newYearValue.length &&
      selectedSplitRanges[0][0] < stepMax &&
      selectedSplitRanges[selectedSplitRanges.length - 1][1] > stepMin &&
      slotsAvailable >= slotsNeeded) {
    return selectedSplitRanges.reduce((acc, sRange, i) => {
      const assignmentsRemaining = ((selectedSplitRanges.length) - i);
      const ceiling = stepMax - (stepVal * assignmentsRemaining);
      let nRange = [...sRange];
      let rollingMin = stepMin;
      if (i !== 0) {
        rollingMin = acc[i - 1][1];
      }
      if (nRange[0] <= stepMin) {
        nRange[0] = rollingMin;
      }
      if (nRange[1] <= stepMin || nRange[1] <= nRange[0]) {
        nRange[1] = nRange[0] + stepVal;
      }
      if (nRange[1] >= stepMax || sRange[1] > ceiling) {
        nRange[1] = ceiling;
      }
      if (nRange[0] >= stepMax || nRange[0] >= nRange[1]) {
        nRange[0] = nRange[1] - stepVal; // times some representation of the index to make room for others
      }
      if (i === 0) {
        // first array needs to start at the stepMin
        nRange[0] = stepMin;
      } else if (i === selectedSplitRanges.length - 1) {
        // last array needs to end at the stepMax
        nRange[1] = stepMax;
      }
      console.log({sRange}, {nRange});
      console.log({acc});
      acc.push(nRange);
      return acc;
    }, []);
  } else {
    return defaultSplits;
  }
};

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