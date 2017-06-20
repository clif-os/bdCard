import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ReactMap.styl';

import syncMove from 'mapbox-gl-sync-move';

// portland = [-122.683145, 45.532482]
const startingPosition = {
  center: [-122.683145, 45.532482],
  zoom: 9,
};

class ReactMap extends Component {
  constructor() {
    super();
    this.firstLoad = false;
    this.controlsLoaded = false;
  }

  componentDidMount() {
    if (!this.firstLoad) {
      const { chosenOptionData, showcaseId } = this.props;
      // when a map is instantiated, it is given a default style
      // -- but the style is specified to the user's selection prior to their seeing it
      const defaultStyle = chosenOptionData.styleUrl;

      let mapMemory;
      if (window.maps) {
        if (Object.keys(window.maps).indexOf(showcaseId) > -1) mapMemory = window.maps[showcaseId];
      }
      this.map = new mapboxgl.Map({
        container: `reactMap-${showcaseId}`,
        style: defaultStyle,
        repaint: true,
        center: mapMemory ? mapMemory.getCenter() : startingPosition.center,
        zoom: mapMemory ? mapMemory.getZoom() : startingPosition.zoom,
        pitch: mapMemory ? mapMemory.getPitch() : 0,
        bearing: mapMemory ? mapMemory.getBearing() : 0,
        attributionControl: true,
      });

      // sync em up using mapbox's handy tool
      // this is probably being called twice in some cases, should find a way to make it only once
      window.maps = {
        ...window.maps,
        [showcaseId]: this.map,
      };
      if (Object.keys(window.maps).length > 1) {
        const maps = Object.values(window.maps);
        syncMove(maps[0], maps[1]);
      }

      this.bindMapEvents();
      this.addControls();
      this.firstLoad = true;
    }
  }

  onMapLoaded() {
    this.firstLoad = false;
  }

  onStyleLoad() {
    const { onBoarding } = this.props;
    if (!onBoarding) {
      const { handleMapLoaded } = this.props;
      // for some reason the style.load event is always before the map actually loads...
      setTimeout(() => {
        handleMapLoaded();
      }, 500);
    }
  }
  switchBasemaps() {
    const { chosenOptionData } = this.props;
    const chosenStyle = chosenOptionData.styleUrl;
    this.map.setStyle(chosenStyle);
  }

  // // MAP BINDING ////
  bindMapEvents() {
    // // LISTEN FOR STYLE CHANGES ////
    const { showcaseId } = this.props;
    window.addEventListener(`LOAD_MAP_${showcaseId}`, this.switchBasemaps.bind(this));
    // // internal map event handlers ////
    this.map.on('load', this.onMapLoaded.bind(this));
    this.map.on('style.load', this.onStyleLoad.bind(this));
  }

  // // CONTROLS ////
  addControls() {
    if (!this.controlsLoaded) {
      // ZOOM CONTROLS
      this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      this.controlsLoaded = true;
    }
  }

  render() {
    const { showcaseId } = this.props;
    return (
      <div id={`reactMap-${showcaseId}`} className="reactMap" />
    );
  }
}

ReactMap.propTypes = {
  dispatch: PropTypes.func.isRequired,
  controlledMap: PropTypes.string.isRequired,
  showcaseId: PropTypes.string.isRequired,
  handleMapLoaded: PropTypes.func.isRequired,
  chosenOptionData: PropTypes.object.isRequired,
  onBoarding: PropTypes.bool.isRequired,
};



const mapStateToProps = state => ({
  controlledMap: state.showcase.controlledMap,
});

export default connect(mapStateToProps)(ReactMap);
