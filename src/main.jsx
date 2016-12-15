import 'babel-polyfill';
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';

const token = 'pk.eyJ1IjoiY2FtcC1hbW9zIiwiYSI6ImNpcjg0cTJvMzAweThnZG5rY2Znazhnc2kifQ.jLCXm1LQmHyDC2RaFTBJNA';

if (!token) {
  throw new Error('Please specify a valid mapbox token');
}

class Root extends Component {

  state = {
    viewport: {
      latitude: 37.785164,
      longitude: -122.41669,
      zoom: 16.140440,
      bearing: -20.55991,
      pitch: 60,
    },
    width: 500,
    height: 500,
  }

  render() {

    const {viewport, width, height} = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/camp-amos/ciwn0ej5z00402pnxt5t42d4o"
        onChangeViewport={v => this.setState({viewport: v})}
        preventStyleDiffing={false}
        mapboxApiAccessToken={token}
        perspectiveEnabled
        width={width}
        height={height} />
    );
  }

}

const root = document.createElement('div');
document.body.appendChild(root);

render(<Root />, root);



// import Chloropleth from './components/Chloropleth.jsx';
// import React from 'react';
// import ReactDOM from 'react-dom';



// ReactDOM.render(<Chloropleth width={1920} height={1080} />, document.getElementById('app'));


