// const color = '#547980' // dark blue-green
// const color = '#4682B4' // steel blue
const color = '#06507A' // darker sidebar blue


export const linePaintIn = {
  'line-width': {
    'stops': [
      [10, .75],
      [11, 1],
      [12, 1.5],
      [13, 1.75],
      [14, 2]
    ]
  },
  'line-opacity': 0.4,
  'line-color': color
}

export const fillPaintIn = {
  'fill-color': color,
  'fill-opacity': 0.3
}

export const linePaintOut = {
  'line-width': {
    'stops': [
      [10, .75],
      [11, 1],
      [12, 1.5],
      [13, 1.75],
      [14, 2]
    ]
  },
  'line-opacity': .15,
  'line-color': color
}

export const fillPaintOut = {
  'fill-color': color,
  'fill-opacity': 0.1
}


// {
//     'stops': [
//       [10, 0.75],
//       [11, 0.6],
//       [12, 0.5],
//       [13, 0.4]
//     ]
//   }