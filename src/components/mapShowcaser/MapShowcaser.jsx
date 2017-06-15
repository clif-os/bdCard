import React, { Component } from 'react';
import './MapShowcaser.styl';
import Map from './map/Map.jsx';
import { mapStyles } from './map/mapStyle_data.jsx';
import LoadingPane from './loader/LoadingPane.jsx';
import MapSelector from './mapSelector/MapSelector.jsx';

class MapShowcaser extends Component {
  constructor(props){
    super();
    this.state = {
      mapLoaded: false, 
      handlingMapChoice: false,
      selectorOpen: true,
      chosenId: null,
      chosenStyle: mapStyles[0],
      mapStyles: mapStyles,
    };
    this.loadMap = this.loadMap.bind(this);
    this.handleMapLoaded = this.handleMapLoaded.bind(this);
    this.handleMapChoice = this.handleMapChoice.bind(this);
  }

  loadMap() {
    this.setState({
      handlingMapChoice: false,
      chosenId: null
    });
  }

  handleMapLoaded(){
    this.setState({
      mapLoaded: true,
      selectorOpen: false,
      handlingMapChoice: false,
      chosenId: null
    });
  }

  handleMapChoice(optionData, nodeId) {
    // set loading spinner back up
    // after loading spinner up, set selector to button state and begin loading map
    // on load pull the spinner up to reveal the map
    this.setState({
      handlingMapChoice: true,
      chosenId: nodeId,
    });
    setTimeout(() => {
      this.loadMap();
    }, 2000)
    /// timeout to fire map loading that respects the loading bar here
  }

  render() {
    // add an id from proptypes
    const { handlingMapChoice, chosenId, chosenStyle, mapStyles } = this.state;
    const { handleMapChoice, handleMapLoaded } = this;
    return (
      <div className="mapShowcaser">
        <LoadingPane active={handlingMapChoice} />
        <div className="tempContainer">
          <MapSelector handleMapChoice={handleMapChoice} chosenId={chosenId} mapStyles={mapStyles} />
        </div>
        <Map handleMapLoaded={handleMapLoaded} style={chosenStyle} />
      </div>
    );
  }
}

 export default MapShowcaser;
 