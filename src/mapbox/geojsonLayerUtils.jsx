// const color = '#547980' // dark blue-green
// const color = '#4682B4' // steel blue
const defaultColor = '#06507A' // darker sidebar blue

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
  'line-color': defaultColor
}

export const fillPaintIn = {
  'fill-color': defaultColor,
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
  'line-color': defaultColor
}

export const fillPaintOut = {
  'fill-color': defaultColor,
  'fill-opacity': 0.1
}

////////////////////////////////
// using: http://colorbrewer2.org/#type=sequential&scheme=PuRd&n=9

const buildPaintPack = (color) => {
  return {
    linePaintIn: {
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
    },
    fillPaintIn: {
      'fill-color': color,
      'fill-opacity': 0.3
    }
  }
}

const buildPaintPacks = (colorIdxs, colorScale) => {
  return colorIdxs.map(index => {
    return buildPaintPack(colorScale[index]);
  });
}

const greenRedColors = {
  '1': '#a50026',
  '2': '#d73027',
  '3': '#f46d43',
  '4': '#fdae61',
  '5': '#fee08b',
  '6': '#d9ef8b',
  '7': '#a6d96a',
  '8': '#66bd63',
  '9': '#1a9850',
  '10': '#a50026'
}

const pinkScaleColors = {
  '1': '#FFFFFF',
  '2': '#f7f4f9',
  '3': '#e7e1ef',
  '4': '#d4b9da',
  '5': '#c994c7',
  '6': '#df65b0',
  '7': '#e7298a',
  '8': '#ce1256',
  '9': '#980043',
  '10': '#67001f'
}

export const generatePaintArray = (classes, colorScheme) => {
  colorScheme = colorScheme.toLowerCase();
  let colorScale;
  let colorIdxs;
  let reverse = false
  if (colorScheme.includes('green') && colorScheme.includes('red')){
    if (colorScheme === 'red to green') reverse = true;
    colorScale = greenRedColors;
    switch(classes){
      case 2:
        colorIdxs = ['4', '7'];
        break;
      case 3:
        colorIdxs = ['4', '7', '9'];
        break;
      case 4:
        colorIdxs = ['4', '6', '8', '10'];
        break;
      case 5:
        colorIdxs = ['2', '4', '6', '8', '10'];
        break;
      case 6:
        colorIdxs = ['2', '4', '6', '8', '9', '10'];
        break;
      case 7:
        colorIdxs = ['2', '4', '6', '7', '8', '9', '10'];
        break;
      case 8:
        colorIdxs = ['2', '4', '5', '6', '7', '8', '9', '10'];
        break;
      case 9:
        colorIdxs = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];
        break;
      case 10:
        colorIdxs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        break;      
    }
  } else if ((colorScheme.includes('increasing') || colorScheme.includes('decreasing')) && colorScheme.includes('pink')){
    colorScale = pinkScaleColors;
    if (colorScheme.includes('decreasing')) reverse = true;
    switch(classes){
      case 2:
        colorIdxs = ['4', '7'];
        break;
      case 3:
        colorIdxs = ['4', '7', '9'];
        break;
      case 4:
        colorIdxs = ['4', '6', '8', '10'];
        break;
      case 5:
        colorIdxs = ['2', '4', '6', '8', '10'];
        break;
      case 6:
        colorIdxs = ['2', '4', '6', '8', '9', '10'];
        break;
      case 7:
        colorIdxs = ['2', '4', '6', '7', '8', '9', '10'];
        break;
      case 8:
        colorIdxs = ['2', '4', '5', '6', '7', '8', '9', '10'];
        break;
      case 9:
        colorIdxs = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];
        break;
      case 10:
        colorIdxs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        break;
    }
  }
  var paintPacks = buildPaintPacks(colorIdxs, colorScale);
  return reverse ? paintPacks.reverse() : paintPacks;
}

//// END GOAL:
// const geojsons = [
//   {
//     geojson: gj,
//     name: 'inFilter',
//     linePaint: linePaintIn,
//     fillPaint: fillPaintIn
//   }
// ]