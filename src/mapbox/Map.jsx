/* global mapboxgl, fetch, document */
global.turf = require('turf');
const debounce = require('debounce');
import './Map.styl';
import {
  geojsonNull,
  geojsonEmpty
} from '../utils/geojsonUtils.jsx'
import {
  buildPopupHTMLFromFeature,
  colorLuminance,
  isTooLightYIQ
} from './generalMapboxUtils.jsx';



export default class Map {
  constructor(geojsons, mapStyle) {
    //// instantiate map ////
    this.map = new mapboxgl.Map({
      container: 'map',
      style: mapStyle,
      repaint: true,
      center: [-70.89185581741563, 42.36291931096801],
      maxBounds: [[-74.2073746412643, 40.949064517736076],[-67.36532786318315, 44.30691815250722]],
      zoom: 8.6,
      attributionControl: false,
      preserveDrawingBuffer: true
    });
    this.defaultBounds = [[-72.01858426851405, 41.94303653564825], [-70.18527815507241, 42.846450867079625]];
    // this.map.boxZoom.disable();
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
    //// customMapboxControls (.jsx) listeners ////
    document.addEventListener('ZOOM_TO_FULL_EXTENT', this.zoomToDataExtent.bind(this));
    document.addEventListener('ZOOM_TO_LAYER', this.zoomToLayer.bind(this));
    
    //// FilterSection.jsx and VisualizationSection.jsx listeners ////
    document.addEventListener('DESELECT_FEATURE', this.deselectFeature.bind(this));

    //// geojsonFilter.jsx listeners ////
    document.addEventListener('DRAW_NEW_GJ', this.redrawMap.bind(this));

    //// Legend.jsx listeners ////
    document.addEventListener('HOVER_LAYER', this.hoverLayer.bind(this));
    document.addEventListener('UNHOVER_LAYER', this.unhoverLayer.bind(this));
    // document.addEventListener('SELECT_LAYER', this.selectLayer.bind(this));

    //// internal map event handlers ////
    this.map.on('mousemove', debounce(this.onMouseMove.bind(this), 5));
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
    // this.consoleLogMapInfo();
    if (features.length) {
      const selectionPaint = features[0].layer.paint
      const id = features[0].properties.GEOID;
      this.selectFeature(id, selectionPaint, e);
    } else {
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

  zoomToLayer(e) {
    this.geojsons.forEach(geojson => {
      if (geojson.name === e.detail){
        const bbox = turf.bbox(geojson.geojson);
        this.map.fitBounds(bbox, {
          padding: '35'
        });
      }
    });
  };

  zoomToDefaultBounds(){
    this.map.fitBounds(this.defaultBounds);
  };

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

  unhover() {
    this.map.getCanvas().style.cursor = '';
    this.map.getSource('hover').setData(geojsonEmpty);
  }

  // the hover and unhover layers probably need to be done more systematically with calculated transparency increases
  // also the record of the previous transparency needs to be known in order to do this properly,
  // otherwise unhover has no idea what to reset to
  hoverLayer(e) {
    const layerName = e.detail;
    this.geojsons.forEach(gj => {
      if (gj.name === layerName) {
        if (layerName === 'outFilter') {
          // outfilter is fairly transparent and needs a less drastic transition
          this.map.setPaintProperty(layerName + '-fills-mimio', 'fill-opacity', .4);
          this.map.setPaintProperty(layerName + '-lines-mimio', 'line-opacity', .7);
        } else {
          const color = gj.fillPaint['fill-color'].slice(1);
          if(isTooLightYIQ(color)){
            const darkerColor = colorLuminance(color, -.2);
            this.map.setPaintProperty(layerName + '-fills-mimio', 'fill-color', darkerColor);
            this.map.setPaintProperty(layerName + '-lines-mimio', 'line-color', darkerColor);
          }
          this.map.setPaintProperty(layerName + '-fills-mimio', 'fill-opacity', .8);
          this.map.setPaintProperty(layerName + '-lines-mimio', 'line-opacity', 1);
        }
      } else if (gj.name !== layerName) {
        if (gj.name === 'inFilter'  || gj.name === 'pass'  || gj.name === 'fail' || gj.name === 'firstPass'  || gj.name === 'secondPass') {
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

  unhoverLayer(e) {
    const layerColor = e.detail.layerColor;
    const layerName = e.detail.layerName
    this.geojsons.forEach(gj => {
      // reset the paint properties, some of the color may have been altered onHover if they were too light
      if (gj.name === layerName) {
        this.map.setPaintProperty(gj.name + '-fills-mimio', 'fill-color', layerColor);
        this.map.setPaintProperty(gj.name + '-lines-mimio', 'line-color', layerColor);
      }
      if (gj.name === 'inFilter' || gj.name === 'pass'  || gj.name === 'fail' || gj.name === 'firstPass'  || gj.name === 'secondPass') {
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

  selectFeature(id, selectionPaint, e) {
    this.map.getSource('selected').setData(window.geojsonLookup[id]);
    window.selectedFeature = window.geojsonLookup[id];
    console.log('SELECTED FEATURE:', selectedFeature);
    this.addSelectionPopup(window.selectedFeature, selectionPaint, e);
  }

  selectLayer(e) {
    const layerName = e.detail;
    this.geojsons.forEach(gj => {
      if (gj.name === layerName) {
        this.map.setPaintProperty(layerName + '-fills-mimio', 'fill-opacity', 1);
        // this.map.getSource('selected').setData(gj.geojson);
      }
    });
  }

  addSelectionPopup(feature, selectionPaint, e) {
    const html = buildPopupHTMLFromFeature(feature, selectionPaint);
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
      this.removeAllSelectionPopups();
    };
  };

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
      this.zoomToDefaultBounds();
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
    this.mapLoaded = true;
    // const visualize = new CustomEvent('VISUALIZE_CLASSES', {'detail': window.defaultVisEvent});
    // document.dispatchEvent(visualize);
  }

}
