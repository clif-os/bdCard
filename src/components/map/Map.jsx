import React, { Component } from 'react';
import './Map.styl';

global.mapboxgl = require('mapbox-gl');

mapboxgl.accessToken = 'pk.eyJ1IjoibWltaW8iLCJhIjoiY2l6ZjJoenBvMDA4eDJxbWVkd2IzZjR0ZCJ9.ppwGNP_-LS2K4jUvgXG2pA';

const startingPosition = {
  center: [-106.3755, 39.6355],
  zoom: 13
}

export default class Map extends Component {
  constructor(props) {
    super();
    this.firstLoad = false;
    this.controlsLoaded = false
  }

  componentDidMount(){
    if (! this.firstLoad){
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mimio/cj3hkvc2h001x2rq9db374sjn',
        repaint: true,
        center: startingPosition.center,
        zoom: startingPosition.zoom,
        attributionControl: true,
      });
      this.bindMapEvents();
      this.addControls();
      this.map.on('style.load', () => {
        // do sumthin
      });
      this.firstLoad = true;
    }
  }

  //// CONTROLS ////
  addControls() {
    if (! this.controlsLoaded) {
      // ZOOM CONTROLS
      this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      this.controlsLoaded = true;
    }
  }

  //// MAP BINDING ////
  bindMapEvents(){
    //// internal map event handlers ////
    this.map.on('load', this.onMapLoaded.bind(this));
    this.map.on('move', this.onMapMove.bind(this));
    this.map.on('mousemove', this.onMouseMove.bind(this));
    this.map.on('click', this.onMapClicked.bind(this));
  }

  onMapLoaded() {
    this.firstLoad = false;
    const { handleMapLoad } = this.props;
    handleMapLoad();
  }

  onMapMove(e) {

  }

  onMouseMove(e) {

  }
  onMapClicked(e) {
    
  }

  render() {
    return (
      <div id='map' />
    )
  }
}
