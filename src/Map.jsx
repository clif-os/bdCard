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
  constructor(geojsons, geojsonTilesets, mapStyle, fields, fillStyles, years) {
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
    this.activeYear = window.activeYear;
    this.activeField = window.activeField;
    this.firstDraw = true;
    this.controlsLoaded = false;
    this.addControls();
    this.bindEvents();
    // tried to bind all events but didn't work for some reason
    this.map.on('style.load', () => {
      this.drawLayers(geojsonTilesets, fillStyles, years, fields);
      this.map.on('mousemove', this.onMouseMove.bind(this));
    });
  }

  bindEvents() {
    this.map.on('click', this.onMapClicked.bind(this));
    this.map.on('dblclick', this.onMapDoubleClicked.bind(this));
    document.addEventListener('YEAR_SWITCH', this.switchYear.bind(this));
    document.addEventListener('FIELD_SWITCH', this.switchField.bind(this));
  }

  switchYear(e) {
    // switch out the layer visibilities unless the year selected is already selected
    if (this.activeYear !== e.detail) {
      this.map.setLayoutProperty('polygon-fills-' + e.detail + '-' + this.activeField, 'visibility', 'visible');
      this.map.setLayoutProperty('polygon-outlines-' + e.detail + '-' + this.activeField, 'visibility', 'visible');
      this.map.setLayoutProperty('polygon-fills-' + this.activeYear + '-' + this.activeField, 'visibility', 'none');
      this.map.setLayoutProperty('polygon-outlines-' + this.activeYear + '-' + this.activeField, 'visibility', 'none');
      this.activeYear = e.detail;
    }
  }

  switchField(e) {
    // switch out the layer visibilities unless the year selected is already selected
    if (this.activeField !== e.detail) {
      this.map.setLayoutProperty('polygon-fills-' + this.activeYear + '-' + e.detail, 'visibility', 'visible');
      this.map.setLayoutProperty('polygon-outlines-' + this.activeYear + '-' + e.detail, 'visibility', 'visible');
      this.map.setLayoutProperty('polygon-fills-' + this.activeYear + '-' + this.activeField, 'visibility', 'none');
      this.map.setLayoutProperty('polygon-outlines-' + this.activeYear + '-' + this.activeField, 'visibility', 'none');
      this.activeField = e.detail;
    }
  }

  zoomToDataExtent() {
    const bbox = turf.bbox(this.geojsons['allYears']);
    this.map.fitBounds(bbox, {
      padding: '35'
    });
  }

  onMouseMove(e) {
    // queries fills and outlines because, at high zooms, outlines take up a 
    // larger amount of the drawspace and will lag hover highlight otherwise
    const fieldAndYear = this.activeYear + '-' + this.activeField;
    var features = this.map.queryRenderedFeatures(e.point, {
      layers: [
        'polygon-fills-' + fieldAndYear,
        'polygon-outlines-' + fieldAndYear
      ]
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
    const fieldAndYear = this.activeYear + '-' + this.activeField;
    var features = this.map.queryRenderedFeatures(e.point, {
      //layers: ['polygon-fills-' + this.activeYear]
      layers: [
        'polygon-fills-' + fieldAndYear,
        'polygon-outlines-' + fieldAndYear
      ]
    });
    console.log("ZOOM LEVEL: " + this.map.getZoom());
    console.log(this.map.getBounds());
    if (features.length) {
      const geoid = features[0].properties.GEOID;
      this.map.getSource('selected').setData(window.geojsonLookup[geoid]);
      window.selectedFeature = window.geojsonLookup[geoid];
      const evt = new CustomEvent('FEATURE_CLICKED');
      document.dispatchEvent(evt);
    } else {
      window.selectedFeature = {};
      this.map.getSource('selected').setData(geojsonEmpty);
      const evt = new CustomEvent('NONFEATURE_CLICKED');
      document.dispatchEvent(evt);
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
      this.map.addControl(new mapboxgl.NavigationControl({
        position: 'top-right'
      }));
    }
    this.controlsLoaded = true;
  }

  drawLayers(geojsonTilesets, fillStyles, years, fields) {
    console.log(fillStyles);
    years.forEach(year => {
      const yr = String(year);
      this.map.addSource(yr, {
        type: 'vector',
        url: geojsonTilesets[yr]
      });
      fields.forEach(field => {
        var polyLayer = {
          id: 'polygon-fills-' + yr + '-' + field,
          type: 'fill',
          source: yr,
          'source-layer': `TBF_TM_${yr}_norm`,
          layout: {
            visibility: 'none'
          },
          paint: {
            'fill-color': fillStyles[field],
            'fill-opacity': 0.4
          }
        }

        var lineLayer = {
          id: 'polygon-outlines-' + yr + '-' + field,
          type: 'line',
          source: yr,
          'source-layer': `TBF_TM_${yr}_norm`,
          layout: {
            visibility: 'none'
          },
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
            'line-color': fillStyles[field]
          }
        }
        if (year === this.activeYear && field === this.activeField) {
          polyLayer.layout.visibility = 'visible';
          lineLayer.layout.visibility = 'visible';
        }

        this.map.addLayer(polyLayer, 'admin-2-boundaries-dispute');
        this.map.addLayer(lineLayer, 'admin-2-boundaries-dispute');
      });
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
        'fill-opacity': 0.10,
      }
    }, 'admin-2-boundaries-dispute');

    this.map.addSource('selected', {
      type: 'geojson',
      data: geojsonEmpty
    });
    this.map.addLayer({
      id: 'polygon-selected',
      type: 'line',
      source: 'selected',
      paint: {
        'line-width': {
          'stops': [
            [10, 1.5],
            [11, 2],
            [12, 2.5],
            [13, 2.5],
            [14, 2.5]
          ]
        },
        'line-color': '#15f4ee',
        'line-opacity': 1,
      }
    }, 'admin-2-boundaries-dispute');

    if (this.firstDraw) {
      this.zoomToDataExtent();
    }
    this.firstDraw = false;
  }
}