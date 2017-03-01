/* global mapboxgl, fetch, document */
global.turf = require('turf');
import './Map.styl';
import {
  geojsonNull
} from '../utils/geojsonUtils.jsx'
import {
  buildPopupHTMLFromFeature
} from './generalMapboxUtils.jsx';

export default class Map {
  constructor(geojsons, mapStyle) {
    //// instantiate map ////
    this.map = new mapboxgl.Map({
      container: 'map',
      style: mapStyle,
      repaint: true,
      center: [-70.89185581741563, 42.36291931096801],
      maxBounds: [
        [-72.25285616365288, 41.71585666269243],
        [-69.53085547116659, 43.003385944623716]
      ],
      zoom: 8.6,
      attributionControl: false
    });
    this.map.boxZoom.disable();
    this.geojsonTilesets;
    this.firstDraw = true;
    this.controlsLoaded = false;
    this.addControls();
    this.bindEvents();
    this.map.on('style.load', () => {
      this.drawLayers(geojsons);
    });
    this.popups = [];
  }

  ///////// ADD CONTROLS /////////

  addControls() {
    if (!this.controlsLoaded) {
      // ZOOM CONTROLS
      this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      this.map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        }
      }), 'bottom-right');
      // var geocoder = new mapboxgl.MapboxGeocoder({
      //   accessToken: mapboxgl.accessToken
      // });
      // this.map.addControl(geocoder);
    }
    this.controlsLoaded = true;
  }

  ///////// BIND EVENTS /////////

  bindEvents() {
    //// geojsonFilter.jsx listeners ////
    document.addEventListener('DRAW_NEW_GJ', this.redrawMap.bind(this));

    //// Legend.jsx listeners ////
    document.addEventListener('HOVER_LAYER', this.hoverLayer.bind(this));
    document.addEventListener('UNHOVER_LAYER', this.unhoverLayer.bind(this));
    // document.addEventListener('SELECT_LAYER', this.selectLayer.bind(this));

    //// internal map event handlers ////
    this.map.on('mousemove', this.onMouseMove.bind(this));
    this.map.on('click', this.onMapClicked.bind(this));
    this.map.on('dblclick', this.onMapDoubleClicked.bind(this));
    this.map.on('load', this.onMapLoaded.bind(this));
  }

  ///////// CUSTOM MAPBOX CONTROL HANDLERS /////////

  redrawMap(e) {
    const geojsons = e.detail;
    this.clearLayers();
    this.drawLayers(geojsons);
  }

  clearLayers() {
    window.sources.forEach(source => {
      this.map.removeSource(source);
    });
    this.map.getStyle().layers.forEach(layer => {
      if (layer.id.indexOf('mimio') !== -1) {
        this.map.removeLayer(layer.id);
      }
    });
  }

  ///////// INTERNAL MAP EVENT HANDLERS /////////

  onMouseMove(e) {
    // queries fills and outlines because, at high zooms, outlines take up a 
    // larger amount of the drawspace and will lag hover highlight otherwise
    var features = this.map.queryRenderedFeatures(e.point, {
      layers: window.drawnLayers
    });
    if (features.length) {
      const id = features[0].properties.GEOID;
      this.hoverFeature(id);
    } else {
      this.unhover();
    }
  }

  onMapClicked(e) {
    var features = this.map.queryRenderedFeatures(e.point, {
      layers: window.drawnLayers
    });
    this.consoleLogMapInfo();
    if (features.length) {
      const id = features[0].properties.GEOID;
      this.selectFeature(id, e);
    } else {
      console.log('deselecting')
      this.deselectFeature();
    }
  }

  onMapDoubleClicked(e) {
    const features = this.map.queryRenderedFeatures(e.point, {
      layers: window.drawnLayers
    });
    // console.log("DOUBLE CLICK")
    if (features.length) {
      const id = features[0].properties.GEOID;
      this.zoomToFeatureExtentById(id);
    }
  }

  ///////// MAJOR UTILS /////////

  zoomToDataExtent() {
    const bbox = turf.bbox(window.geojson);
    this.map.fitBounds(bbox, {
      padding: '35'
    });
  }

  zoomToFeatureExtentById(id) {
    const bbox = turf.bbox(window.geojsonLookup[id]);
    this.map.fitBounds(bbox, {
      padding: '100'
    });
  }

  hoverFeature(id) {
    this.map.getCanvas().style.cursor = 'pointer'
    this.map.getSource('hover').setData(window.geojsonLookup[id]);
  }

  hoverLayer(e){
    const layerName = e.detail;
    this.map.setPaintProperty(layerName + '-fills-mimio', 'fill-opacity', .8);
    this.map.setPaintProperty(layerName + '-lines-mimio', 'line-opacity', 1);
    this.geojsons.forEach(gj => {
      if (gj.name !== layerName){
        if (gj.name === 'inFilter'){
          this.map.setPaintProperty(gj.name + '-fills-mimio', 'fill-opacity', .3);
          this.map.setPaintProperty(gj.name + '-lines-mimio', 'line-opacity', .4);
        } else if (gj.name === 'outFilter') {
          this.map.setPaintProperty(gj.name + '-fills-mimio', 'fill-opacity', .05);
          this.map.setPaintProperty(gj.name + '-lines-mimio', 'line-opacity', .1);
        } else {
          this.map.setPaintProperty(gj.name + '-fills-mimio', 'fill-opacity', .3);
          this.map.setPaintProperty(gj.name + '-lines-mimio', 'line-opacity', .6);
        }
        
      } 
    });
  }

  unhoverLayer(){
    this.geojsons.forEach(gj => {
      if (gj.name === 'inFilter'){
        this.map.setPaintProperty(gj.name + '-fills-mimio', 'fill-opacity', .4);
        this.map.setPaintProperty(gj.name + '-lines-mimio', 'line-opacity', .6);
      } else if (gj.name === 'outFilter') {
        this.map.setPaintProperty(gj.name + '-fills-mimio', 'fill-opacity', .1);
        this.map.setPaintProperty(gj.name + '-lines-mimio', 'line-opacity', .15);
      } else {
        this.map.setPaintProperty(gj.name + '-fills-mimio', 'fill-opacity', .6);
        this.map.setPaintProperty(gj.name + '-lines-mimio', 'line-opacity', .8);
      }
    });
  }

  unhover(id) {
    this.map.getCanvas().style.cursor = '';
    this.map.getSource('hover').setData(geojsonNull);
  }

  selectFeature(id, e) {
    this.map.getSource('selected').setData(window.geojsonLookup[id]);
    window.selectedFeature = window.geojsonLookup[id];
    console.log('SELECTED FEATURE:', selectedFeature);
    this.addSelectionPopup(window.selectedFeature, e);
  }

  selectLayer(e){
    const layerName = e.detail;
    this.geojsons.forEach(gj => {
      if (gj.name === layerName){
        this.map.setPaintProperty(layerName + '-fills-mimio', 'fill-opacity', 1);
        // this.map.getSource('selected').setData(gj.geojson);
      }
    })
  }

  addSelectionPopup(feature, e) {
    const html = buildPopupHTMLFromFeature(feature);
    if (this.popups.length > 0) {
      this.removeAllSelectionPopups()
    };
    const selectionPopup = new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(html)
      .addTo(this.map);
    this.popups.push(selectionPopup)
  }

  removeAllSelectionPopups() {
    this.popups.forEach(popup => {
      popup.remove();
    })
  }

  deselectFeature() {
    if (window.selectedFeature !== null) {
      window.selectedFeature = null;
      this.map.getSource('selected').setData(geojsonNull);
    }
  }

  ///////// DRAWING AND UNDRAWING /////////

  drawLayers(geojsons) {
    if (this.firstDraw) {
      // add a dedicated source and layer to collect the currently hovered feature at all times
      this.map.addSource('hover', {
        type: 'geojson',
        data: geojsonNull
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
        data: geojsonNull
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
          'line-opacity': 1
        }
      }, 'admin-2-boundaries-dispute');
    }
    //'#FFFF25' decent yellow
    //#15f4ee esri neon blue

    window.drawnLayers = [];
    window.sources = [];
    this.geojsons = geojsons;
    geojsons.forEach(geojson => {
      window.sources.push(geojson.name);
      this.map.addSource(geojson.name, {
        type: 'geojson',
        data: geojson.geojson
      });
      const polyLayerId = geojson.name + '-fills-mimio';
      const polyLayer = {
        id: polyLayerId,
        type: 'fill',
        source: geojson.name,
        paint: geojson.fillPaint
      };
      const lineLayerId = geojson.name + '-lines-mimio';
      const lineLayer = {
        id: lineLayerId,
        type: 'line',
        source: geojson.name,
        paint: geojson.linePaint
      };
      // active layers need to be known for querying purposes
      window.drawnLayers.push(polyLayerId, lineLayerId);
      // second variable is the layer in the mapbox style you'd like the layers to be drawn directly above of
      this.map.addLayer(polyLayer, 'polygon-hover');
      this.map.addLayer(lineLayer, 'polygon-hover');
    });
    
    if (this.firstDraw) {
      // MAYBE MOVE THIS UP HIGHER
      // this feature can be nice for zooming to the data on load
      this.zoomToDataExtent();
      this.firstDraw = false;
    }

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


  // drawTilesetLayers(geojsonTilesets) {
  //   // add all tilesets
  //   window.drawnLayers = []
  //   geojsonTilesets.forEach(tileset => {
  //     this.map.addSource(tileset.name, {
  //       type: 'vector',
  //       url: tileset.sourceUrl
  //     });
  //     var polyLayer = {
  //       id: tileset.name + '-fills',
  //       type: 'fill',
  //       source: tileset.name,
  //       'source-layer': tileset.sourceLayer,
  //       layout: {
  //         // visibility: 'none'
  //       },
  //       paint: {
  //         'fill-color': 'tomato',
  //         'fill-opacity': 0.5
  //       }
  //     }
  //     var lineLayer = {
  //       id: tileset.name + '-outlines',
  //       type: 'line',
  //       source: tileset.name,
  //       'source-layer': tileset.sourceLayer,
  //       layout: {
  //         // visibility: 'none'
  //       },
  //       paint: {
  //         'line-width': {
  //           'stops': [
  //             [10, .75],
  //             [11, 1],
  //             [12, 1.5],
  //             [13, 1.75],
  //             [14, 2]
  //           ]
  //         },
  //         'line-opacity': {
  //           'stops': [
  //             [10, 0.75],
  //             [11, 0.6],
  //             [12, 0.5],
  //             [13, 0.4]
  //           ]
  //         },
  //         'line-color': 'tomato'
  //       }
  //     }
  //     // active layers need to be known for querying purposes
  //     window.drawnLayers.push(tileset.name + '-fills', tileset.name + '-outlines')
  //     // second variable is the layer in the mapbox style you'd like the layers to be drawn directly above of
  //     this.map.addLayer(polyLayer, 'admin-2-boundaries-dispute');
  //     this.map.addLayer(lineLayer, 'admin-2-boundaries-dispute');
  //   });

  //   // add a dedicated source and layer to collect the currently hovered feature at all times
  //   this.map.addSource('hover', {
  //     type: 'geojson',
  //     data: geojsonNull
  //   });
  //   this.map.addLayer({
  //     id: 'polygon-hover',
  //     type: 'fill',
  //     source: 'hover',
  //     paint: {
  //       'fill-color': 'black',
  //       'fill-opacity': 0.10
  //     }
  //   }, 'admin-2-boundaries-dispute');

  //   // add a dedicated source and layer to collect the currently selected feature at all times
  //   this.map.addSource('selected', {
  //     type: 'geojson',
  //     data: geojsonNull
  //   });
  //   this.map.addLayer({
  //     id: 'polygon-selected',
  //     type: 'line',
  //     source: 'selected',
  //     paint: {
  //       'line-width': {
  //         'stops': [
  //           [10, 1.5],
  //           [11, 2],
  //           [12, 2.5],
  //           [13, 2.5],
  //           [14, 2.5]
  //         ]
  //       },
  //       'line-color': '#15f4ee',
  //       'line-opacity': 1,
  //     }
  //   }, 'admin-2-boundaries-dispute');

  //   // this feature can be nice for zooming to the data on load
  //   if (this.firstDraw) {
  //     this.zoomToDataExtent();
  //   }

  //   this.firstDraw = false;
  // }