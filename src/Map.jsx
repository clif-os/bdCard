/* global mapboxgl, fetch, document */
global.turf = require('turf');
import './Map.styl';
import {
  geojsonEmpty,
} from './utils/geojsonUtils.jsx'
import {
  generateChoroplethFillStyle
} from './utils/mapboxUtils.jsx'


export default class Map {
  constructor(geojsons, geojsonTilesets, mapStyle, fields, initialFillStyle, years) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: mapStyle,
      repaint: true,
      center: [0, 38],
      maxBounds: [
        [-71.57730000000001, 42.09960000000001],
        [-70.52729999999997, 42.61038972219174]
        ],
      zoom: 10.27
    });
    this.map.boxZoom.disable();
    // this.drawQueue = [];
    this.geojsons = geojsons;
    this.geojsonTilesets;
    this.activeYear = '1990';
    this.firstDraw = true;
    this.controlsLoaded = false;
    this.addControls();
    this.bindEvents();
    // tried to bind all events but didn't work for some reason
    console.log(initialFillStyle);
    this.map.on('style.load', () => {
      this.drawLayers(geojsonTilesets, initialFillStyle, years);
      this.map.on('mousemove', this.onMouseMove.bind(this));
    });
  }

  bindEvents() {
    this.map.on('click', this.onMapClicked.bind(this));
    this.map.on('dblclick', this.onMapDoubleClicked.bind(this));
    document.addEventListener('YEAR_SWITCH', this.switchYear.bind(this));
  }

  switchYear(e) {
    // switch out the layer visibilities unless the year selected is already selected
    if (this.activeYear !== e.detail) {
      this.map.setLayoutProperty('polygon-fills-' + e.detail, 'visibility', 'visible');
      this.map.setLayoutProperty('polygon-outlines-' + e.detail, 'visibility', 'visible');
      this.map.setLayoutProperty('polygon-fills-' + this.activeYear, 'visibility', 'none');
      this.map.setLayoutProperty('polygon-outlines-' + this.activeYear, 'visibility', 'none');
      this.activeYear = e.detail;
    }
  }

  zoomToDataExtent(){
    const bbox = turf.bbox(this.geojsons['allYears']);
      this.map.fitBounds(bbox, {
        padding: '35'
      });
  }

  // sendLegendToReact(fillColorStyle){
  //   window.legend = fillColorStyle
  //   const evt = new CustomEvent('LOAD_FIELD');
  //   document.dispatchEvent(evt);
  // }

  switchField() {

  }

  onMouseMove(e) {
    var features = this.map.queryRenderedFeatures(e.point, {
      layers: ['polygon-fills-' + this.activeYear]
    });
    if (features.length) {
      const geoid = features[0].properties.GEOID;
      this.map.getCanvas().style.cursor = 'pointer'
      this.map.getSource('hover').setData(window.geojsonLookup[geoid]);
    } else {
      this.map.getCanvas().style.cursor = ''
      this.map.getSource('hover').setData(geojsonEmpty);
    }
  }

  onMapClicked(e) {
    var features = this.map.queryRenderedFeatures(e.point, {
      //layers: ['polygon-fills-' + this.activeYear]
      layers: ['polygon-hover']
    });
    console.log("ZOOM LEVEL: " + this.map.getZoom());
    console.log(this.map.getBounds());
    if (features.length) {
      const geoid = features[0].properties.GEOID;
      console.log(window.geojsonLookup[geoid]);
    }
  }

  onMapDoubleClicked(e) {
    const features = this.map.queryRenderedFeatures(e.point, {
      layers: ['polygon-fills-' + this.activeYear]
    });
    console.log("DOUBLE CLICK")
    console.log(features)
  }

  addControls() {
    if (!this.controlsLoaded) {
      // ZOOM CONTROLS
      var nav = new mapboxgl.NavigationControl();
      this.map.addControl(nav, 'top-right');
    }
    this.controlsLoaded = true;
  }

  drawLayers(geojsonTilesets, fillStyle, years) {
    years.forEach(year => {
      const yr = String(year);
      this.map.addSource(yr, {
        type: 'vector',
        url: geojsonTilesets[yr]
      });

      var polyLayer = {
        id: 'polygon-fills-' + yr,
        type: 'fill',
        source: yr,
        'source-layer': `TBF_TM_${yr}_norm`,
        layout: {},
        paint: {
          'fill-color': fillStyle,
          'fill-opacity': 0.4
        }
      }

      var lineLayer = {
        id: 'polygon-outlines-' + yr,
        type: 'line',
        source: yr,
        'source-layer': `TBF_TM_${yr}_norm`,
        layout: {},
        paint: {
          'line-width': {
            'stops': [
              [10, .75],
              [11, 1],
              [12, 1.5],
              [13, 1.75],
              [14, 2]
            ]
          },
          'line-opacity': {
            'stops': [
              [10, 0.75],
              [11, 0.6],
              [12, 0.5],
              [13, 0.4]
            ]
          },
          'line-color': fillStyle
        }
      }

      if (yr !== this.activeYear) {
        polyLayer.layout.visibility = 'none';
        lineLayer.layout.visibility = 'none';
      }

      this.map.addLayer(polyLayer, 'admin-2-boundaries-dispute');
      this.map.addLayer(lineLayer, 'admin-2-boundaries-dispute');
    });

    this.map.addSource('hover', {
      type: 'geojson',
      data: geojsonEmpty
    });

    this.map.addLayer({
      id: 'polygon-hover',
      type: 'fill',
      source: 'hover',
      paint: {
        'fill-color': 'black',
        'fill-opacity': 0.15,
      }
    }, 'admin-2-boundaries-dispute');
    if (this.firstDraw) {
      this.zoomToDataExtent();
    }
    this.firstDraw = false;
  }
}