/* global mapboxgl, fetch, document */

// import 'object.observe';
global.turf = require('turf');
import './Map.styl';
export default class Map {
  constructor(geojsons, mapStyle) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: mapStyle,
      repaint: true,
      center: [0, 38],
      zoom: 1
    });
    this.map.boxZoom.disable();
    this.drawQueue = [];
    this.geojson = geojsons.allYears;
    this.firstDraw = true;
    this.controlsLoaded = false;
    this.bindEvents();
    // tried to bind all events but didn't work for some reason
    this.map.on('style.load', () => {
      this.drawLayers(this.geojson);
    });
  }

  bindEvents() {
    this.map.on('click', this.onMapClicked.bind(this));
    this.map.on('dblclick', this.onMapDoubleClicked.bind(this));
  }

  onMouseMove(e) {
    var features = this.map.queryRenderedFeatures(e.point, {
      layers: ['polygon-fills']
    });
  }

  onMapClicked(e) {
    var features = this.map.queryRenderedFeatures(e.point, {
      layers: ['polygon-fills']
    });
    console.log("SINGLE CLICK")
    console.log(features)
  }

  onMapDoubleClicked(e) {
    const features = this.map.queryRenderedFeatures(e.point, {
      layers: ['polygon-fills']
    });
    console.log("DOUBLE CLICK")
    console.log(features)
  }

  addControls() {
    if (!this.controlsLoaded) {
      // ZOOM CONTROLS
      this.map.addControl(new mapboxgl.Navigation({
        position: 'top-right'
      }));
    }
    this.controlsLoaded = true;
  }

  drawLayers(geojson) {
    if (this.firstDraw) {
      const bbox = turf.bbox(geojson);
      this.map.fitBounds(bbox, {
        padding: '20'
      });
    }

    this.map.addSource('drawnFeatures', {
      type: 'geojson',
      data: geojson
    });

    this.map.addLayer({
      id: 'polygon-fills',
      type: 'fill',
      source: 'drawnFeatures',
      paint: {
        'fill-color': "blue",
        'fill-opacity': 0.3,
      }
    });

    this.map.addLayer({
      id: 'polygon-outlines',
      type: 'line',
      source: 'drawnFeatures',
      paint: {
        'line-width': {
          'stops': [
            [1, 1.5],
            [2, 1.75],
            [3, 2],
            [4, 2.5],
            [5, 3]
          ]
        },
        'line-opacity': {
          'stops': [
            [1, 0.8],
            [2, 0.7],
            [3, 0.6],
            [4, 0.5]
          ]
        },
        'line-color': "blue"
      }
    });
    this.firstDraw = false;
  }
}