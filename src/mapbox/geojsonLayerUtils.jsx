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
  'line-opacity': 0.6,
  'line-color': defaultColor
}

export const fillPaintIn = {
  'fill-color': defaultColor,
  'fill-opacity': 0.4
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

import { splitGeojsonByCriteria, splitGeojsonByFieldAndClasses } from '../filter/filterUtils.jsx';

const buildPaintPack = (color) => {
  return {
    linePaint: {
      'line-width': {
        'stops': [
          [10, .75],
          [11, 1],
          [12, 1.5],
          [13, 1.75],
          [14, 2]
        ]
      },
      'line-opacity': 0.8,
      'line-color': color
    },
    fillPaint: {
      'fill-color': color,
      'fill-opacity': 0.6
    }
  }
}

const buildPaintPacks = (colorIdxs, colorScale) => {
  return colorIdxs.map(index => {
    return buildPaintPack(colorScale[index]);
  });
}

// all color arrays include a NULL color
const greenRedColors = {
  '1': '#006837',
  '2': '#1a9850',
  '3': '#66bd63',
  '4': '#a6d96a',
  '5': '#d9ef8b',
  '6': '#fee08b',
  '7': '#fdae61',
  '8': '#f46d43',
  '9': '#d73027',
  '10': '#a50026',
  'null': '#000000'
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
  '10': '#67001f',
  'null': '#000000'
}

const greenScaleColors = {
  '1': '#FFFFFF',
  '2': '#f7fcf5',
  '3': '#e5f5e0',
  '4': '#c7e9c0',
  '5': '#a1d99b',
  '6': '#74c476',
  '7': '#41ab5d',
  '8': '#238b45',
  '9': '#006d2c',
  '10': '#00441b',
  'null': '#000000'
}

const redScaleColors = {
  '1': '#FFFFFF',
  '2': '#fff5f0',
  '3': '#fee0d2',
  '4': '#fcbba1',
  '5': '#fc9272',
  '6': '#fb6a4a',
  '7': '#ef3b2c',
  '8': '#cb181d',
  '9': '#a50f15',
  '10': '#67000d',
  'null': '#000000'
}

const blueScaleColors = {
  '1': '#FFFFFF',
  '2': '#f7fbff',
  '3': '#deebf7',
  '4': '#c6dbef',
  '5': '#9ecae1',
  '6': '#6baed6',
  '7': '#4292c6',
  '8': '#2171b5',
  '9': '#08519c',
  '10': '#08306b',
  'null': '#000000'
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
        colorIdxs = ['2', '9'];
        break;
      case 3:
        colorIdxs = ['2', '7', '9'];
        break;
      case 4:
        colorIdxs = ['2', '6', '7', '9'];
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
  } else if ((colorScheme.includes('increasing') || colorScheme.includes('decreasing'))){
    if (colorScheme.includes('decreasing')) reverse = true;
    switch(colorScheme.split(' ')[1]){
      case 'pink':
        colorScale = pinkScaleColors;    
        break;
      case 'blue':
        colorScale = blueScaleColors;
        break;
      case 'red':
        colorScale = redScaleColors;
        break;
      case 'green':
        colorScale = greenScaleColors;
        break;
      default:
        break;
    }
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
  if (reverse) colorIdxs.reverse();
  // push in null value to catch nulls
  colorIdxs.push('null')
  var paintPacks = buildPaintPacks(colorIdxs, colorScale);
  return paintPacks;
}

export const buildGeojsonLayerArray = (gj, field, classes, palette, unitFormatter) => {
  const paints = generatePaintArray(classes, palette);
  const geojsons = splitGeojsonByFieldAndClasses(gj, field, classes, unitFormatter);
  if (geojsons.length !== paints.length){
    console.error('incoming geojsons and paints to "buildGeojsonLayerArray" are different lengths, these should always be the same length')
  }
  var gjLayers = [];
  // arbitrarily chosing to loop over geojsons, could also be paints
  geojsons.forEach((gj, i) => {
    const order = i + 1
    // currently, build geojsonLayerArray assumes that the incoming gjs meet the filter criteria,
    // later on this might not be the case and should be added as a variable
    gjLayers.push(
      {
        geojson: gj,
        name: 'field-class' + order,
        filterStatus: 'Meets Filter Criteria',
        linePaint: paints[i].linePaint,
        fillPaint: paints[i].fillPaint
      }
    )
  });
  return gjLayers;
}
