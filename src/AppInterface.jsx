import React, { Component } from 'react';
import './AppInterface.styl';
import Map from './components/map/map.jsx';
import LoadingPane from './components/loader/LoadingPane.jsx';
import MapSelector from './components/mapSelector/MapSelector.jsx';

class AppInterface extends Component {
  constructor(props){
    super();
    this.state = {
      mapLoaded: false, 
      handlingMapChoice: false,
      selectorOpen: true,
    };
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapChoice = this.handleMapChoice.bind(this);
  }

  handleMapLoad(){
    this.setState({
      mapLoaded: true,
      selectorOpen: false,
      handlingMapChoice: false,
    });
    const loadingPane = document.getElementById('primaryLoadingPane');
    loadingPane.classList.add('loadingPane-inactive');
    loadingPane.classList.remove('loadingPane-active');
    window.setTimeout(() => {
      loadingPane.style.display = 'none';
    }, 500);
  }

  handleMapChoice() {
    //  set loading spinner back up
    // after loading spinner up, set selector to button state and begin loading map
    // on load pull the spinner up to reveal the map
    this.setState({
      handlingMapChoice: true
    });
    setTimeout(() => {
      this.setState({
        handlingMapChoice: false
      });
    }, 2000)
    /// timeout to fire map loading that respects the loading bar here
  }

  render() {
    const { handlingMapChoice } = this.state;
    return (
      <div className="AppInterface">
        <LoadingPane active={handlingMapChoice} />
        <div className="tempContainer">
          <MapSelector handleMapChoice={this.handleMapChoice} />
        </div>
        <Map handleMapLoad={this.handleMapLoad} />
      </div>
    );
  }
}

// <Map handleMapLoad={this.handleMapLoad} />

 export default AppInterface;
 