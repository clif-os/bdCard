import React, { Component } from 'react';
import './AppInterface.styl';
import Map from './components/map/map.jsx';

class AppInterface extends Component {
  constructor(props){
    super();
    this.state = {
      mapLoaded: false
    };
    this.handleMapLoad = this.handleMapLoad.bind(this);
  }

  handleMapLoad(){
    this.setState({
      mapLoaded: true
    });
    const loadingPane = document.getElementById('mainLoadingPane');
    loadingPane.style.bottom = '100%';
    window.setTimeout(() => {
      loadingPane.style.display = 'none';
    }, 500);
  }

  render() {
    return (
      <div className="AppInterface">
        <Map handleMapLoad={this.handleMapLoad} />
      </div>
    );
  }
}

// <Map handleMapLoad={this.handleMapLoad} />

 export default AppInterface;
 