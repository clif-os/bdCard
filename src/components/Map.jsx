import Immutable from 'immutable';

import React, {PropTypes, Component} from 'react';
import MapGL, {ChoroplethOverlay} from 'react-map-gl';

// San Francisco
import NINETY from '../data/TBF_TM_1990_norm.json';
import ALL from '../data/TBF_TM_all.json';

console.log(ALL);

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: 11,
        startDragLngLat: null,
        isDragging: false
      }
    };
  }
  _onChangeViewport(viewport) {
    if (this.props.onChangeViewport) {
      return this.props.onChangeViewport(viewport);
    }
    this.setState({viewport});
  }

  render() {
    const mapProps = {
      ...this.state.viewport,
      ...this.props,
      onChangeViewport: this._onChangeViewport
    };
    return (
      <MapGL { ...mapProps}>
      </MapGL>
    );
  }
}

ChoroplethOverlayExample.propTypes = PROP_TYPES;

export default Map;

// import React, { Component } from "react";
// import featuresAll from "../data/TBF_TM_all.json";
// import MapGL from 'react-map-gl';

// console.log("trying to render")

// class Map extends React.Component {

//   render() {
//     return (
//       <MapGL
//       width={700}
//       height={450}
//       latitude={37.78}
//       longitude={-122.45}
//       zoom={11}
//       mapboxApiAccessToken={'pk.eyJ1IjoiY2FtcC1hbW9zIiwiYSI6ImNpcjg0cTJvMzAweThnZG5rY2Znazhnc2kifQ.jLCXm1LQmHyDC2RaFTBJNA'}
//       mapStyle={'mapbox://styles/camp-amos/ciwn0ej5z00402pnxt5t42d4o'}
//     />
//     );
//   }
// }

// export default Map;