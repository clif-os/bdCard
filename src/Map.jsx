/* global mapboxgl, fetch, document */
global.turf = require('turf');
import './Map.styl';
import {
  geojsonEmpty
} from './utils/geojsonUtils.jsx'

export default class Map {
  constructor(geojsonTilesets, mapStyle) {
    //// instantiate map ////
    this.map = new mapboxgl.Map({
      container: 'map',
      style: mapStyle,
      repaint: true,
      center: [0, 38],
      maxBounds: [
        [-71.57730000000001, 42.09960000000001],
        [-70.52729999999997, 42.61038972219174]
      ],
      zoom: 10.27,
      attributionControl: false
    });
    this.map.boxZoom.disable();
    this.geojsonTilesets;
    this.firstDraw = true;
    this.controlsLoaded = false;
    this.addControls();
    this.bindEvents();
    // tried to bind all events but didn't work for some reason
    this.map.on('style.load', () => {
      this.drawLayers(geojsonTilesets);
      this.map.on('mousemove', this.onMouseMove.bind(this));
    });
  }

  ///////// ADD CONTROLS /////////

  addControls() {
    if (!this.controlsLoaded) {
      // ZOOM CONTROLS
      this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    }
    this.controlsLoaded = true;
  }

  ///////// BIND EVENTS /////////

  bindEvents() {
    //// internal map event handlers ////
    this.map.on('click', this.onMapClicked.bind(this));
    this.map.on('dblclick', this.onMapDoubleClicked.bind(this));
    this.map.on('load', this.onMapLoaded.bind(this));
  }

  ///////// CUSTOM MAPBOX CONTROL HANDLERS /////////



  ///////// INTERNAL MAP EVENT HANDLERS /////////

  onMouseMove(e) {
    // queries fills and outlines because, at high zooms, outlines take up a 
    // larger amount of the drawspace and will lag hover highlight otherwise
    var features = this.map.queryRenderedFeatures(e.point, {
      layers: window.drawnLayers
    });
    if (features.length) {
      const geoid = features[0].properties.GEOID;
      this.map.getCanvas().style.cursor = 'pointer'
      this.map.getSource('hover').setData(window.geojsonLookup[geoid]);
    } else {
      this.map.getCanvas().style.cursor = '';
      this.map.getSource('hover').setData(geojsonEmpty);
    }
  }

  onMapClicked(e) {
    var features = this.map.queryRenderedFeatures(e.point, {
      layers: window.drawnLayers
    });
    // console.log("ZOOM LEVEL: " + this.map.getZoom());
    // console.log(this.map.getBounds());
    if (features.length) {
      const geoid = features[0].properties.GEOID;
      this.map.getSource('selected').setData(window.geojsonLookup[geoid]);
      window.selectedFeature = window.geojsonLookup[geoid];
      console.log('SELECTED FEATURE:', selectedFeature)
      // const evt = new CustomEvent('FEATURE_CLICKED');
      // document.dispatchEvent(evt);
    } else {
      window.selectedFeature = {};
      this.map.getSource('selected').setData(geojsonEmpty);
      console.log('NO FEATURES SELECTED')
      // const evt = new CustomEvent('NONFEATURE_CLICKED');
      // document.dispatchEvent(evt);
    }
  }

  onMapDoubleClicked(e) {
    const features = this.map.queryRenderedFeatures(e.point, {
      layers: window.drawnLayers
    });
    // console.log("DOUBLE CLICK")
    if (features.length) {
      const geoid = features[0].properties.GEOID;
      this.zoomToFeatureExtentByGeoID(geoid);
    }
  }

  ///////// MAJOR UTILS /////////

  zoomToDataExtent() {
    const bbox = turf.bbox(window.geojson);
    this.map.fitBounds(bbox, {
      padding: '35'
    });
  }

  zoomToFeatureExtentByGeoID(geoid) {
    const bbox = turf.bbox(window.geojsonLookup[geoid]);
    this.map.fitBounds(bbox, {
      padding: '100'
    });
  }

  ///////// DRAWING AND UNDRAWING /////////

  drawLayers(geojsonTilesets) {
    // add all tilesets
    window.drawnLayers = []
    geojsonTilesets.forEach(tileset => {
      this.map.addSource(tileset.name, {
        type: 'vector',
        url: tileset.sourceUrl
      });
      var polyLayer = {
        id: tileset.name + '-fills',
        type: 'fill',
        source: tileset.name,
        'source-layer': tileset.sourceLayer,
        layout: {
          // visibility: 'none'
        },
        paint: {
          'fill-color': 'tomato',
          'fill-opacity': 0.5
        }
      }
      var lineLayer = {
        id: tileset.name + '-outlines',
        type: 'line',
        source: tileset.name,
        'source-layer': tileset.sourceLayer,
        layout: {
          // visibility: 'none'
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
          'line-color': 'tomato'
        }
      }
      // active layers need to be known for querying purposes
      window.drawnLayers.push(tileset.name + '-fills', tileset.name + '-outlines')
      // second variable is the layer in the mapbox style you'd like the layers to be drawn directly above of
      this.map.addLayer(polyLayer, 'admin-2-boundaries-dispute');
      this.map.addLayer(lineLayer, 'admin-2-boundaries-dispute');
    });

    // add a dedicated source and layer to collect the currently hovered feature at all times
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
        'fill-opacity': 0.10
      }
    }, 'admin-2-boundaries-dispute');

    // add a dedicated source and layer to collect the currently selected feature at all times
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

    // this feature can be nice for zooming to the data on load
    if (this.firstDraw) {
      this.zoomToDataExtent();
    }

    this.firstDraw = false;
  }

  ///////// MISCELANEOUS UTILS /////////
  consoleLogMapInfo() {
    console.log("ZOOM LEVEL: " + this.map.getZoom());
    console.log("CENTER: " + this.map.getCenter());
    console.log("BOUNDS: " + this.map.getBounds());
  }

  ///////// COMMUNICATE MAP LOADED /////////
  onMapLoaded() {
    const evt = new CustomEvent('MAP_LOADED')
    document.dispatchEvent(evt);
    this.mapLoaded = true
  }

}