import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ReactMap.styl';

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
      const defaultStyle = chosenOptionData.styleUrl;
      this.map = new mapboxgl.Map({
        container: `reactMap-${showcaseId}`,
        style: defaultStyle,
        repaint: true,
        center: startingPosition.center,
        zoom: startingPosition.zoom,
        attributionControl: true,
      });
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

  // onMapMove(e) {

  // }

  // onMouseMove(e) {

  // }
  // onMapClicked(e) {

  // }

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
    // this.map.on('move', this.onMapMove.bind(this));
    // this.map.on('mousemove', this.onMouseMove.bind(this));
    // this.map.on('click', this.onMapClicked.bind(this));
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
  showcaseId: PropTypes.string.isRequired,
  handleMapLoaded: PropTypes.func.isRequired,
  chosenOptionData: PropTypes.object.isRequired,
  onBoarding: PropTypes.bool.isRequired,
};

export default ReactMap;
