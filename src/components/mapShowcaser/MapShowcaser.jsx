import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleSelectorOpen, prepareMapLoad, mapLoaded } from '../../actions/index.jsx';
import './MapShowcaser.styl';
import ReactMap from './map/ReactMap.jsx';
import { mapStyles } from './map/mapStyle_data.jsx';
import LoadingPane from './loader/LoadingPane.jsx';
import MapSelector from './mapSelector/MapSelector.jsx';

const loadMap = (showcaseId) => {
  const evt = new CustomEvent(`LOAD_MAP_${showcaseId}`);
  window.dispatchEvent(evt);
};

class MapShowcaser extends Component {
  constructor() {
    super();
    this.handleMapLoaded = this.handleMapLoaded.bind(this);
    this.handleMapChoice = this.handleMapChoice.bind(this);
  }

  handleMapLoaded() {
    const { showcaseId } = this.props;
    console.log(`MAP ${showcaseId} LOADED`);
    this.props.dispatch(mapLoaded(showcaseId));
  }

  handleMapChoice(optionData, nodeId) {
    const { showcaseId } = this.props;
    const { dispatch } = this.props;
    dispatch(prepareMapLoad(showcaseId, nodeId, optionData));
    // timeouts are for staggering animations,
    // need to set up a special way to cause instant transitions
    setTimeout(() => {
      dispatch(toggleSelectorOpen(showcaseId));
    }, 300);
    setTimeout(() => {
      loadMap(showcaseId);
    }, 500);
  }

  render() {
    const { showcaseId, handlingMapChoice, chosenId,
            onBoarding, chosenOptionData, selectorOpen } = this.props;
    const { handleMapChoice, handleMapLoaded } = this;
    return (
      <div className="mapShowcaser">
        <LoadingPane active={handlingMapChoice} />
        <div className="mapSelector-container">
          <MapSelector
            showcaseId={showcaseId}
            handleMapChoice={handleMapChoice} chosenId={chosenId}
            mapStyles={mapStyles} onBoarding={onBoarding} open={selectorOpen}
          />
        </div>
        <ReactMap
          showcaseId={showcaseId}
          handleMapLoaded={handleMapLoaded} chosenOptionData={chosenOptionData}
          onBoarding={onBoarding}
        />
      </div>
    );
  }
}

MapShowcaser.propTypes = {
  showcaseId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  chosenId: PropTypes.string.isRequired,
  handlingMapChoice: PropTypes.bool.isRequired,
  onBoarding: PropTypes.bool.isRequired,
  chosenOptionData: PropTypes.object.isRequired,
  selectorOpen: PropTypes.bool.isRequired,
};

export default connect()(MapShowcaser);
