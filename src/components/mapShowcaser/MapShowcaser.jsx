import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleSelectorOpen, prepareMapLoad, mapLoaded } from '../../actions/index.jsx';
import './MapShowcaser.styl';
import ReactMap from './map/ReactMap.jsx';
import { mapStyles } from './map/mapStyle_data.jsx';
import LoadingPane from './loader/LoadingPane.jsx';
import MapSelector from './mapSelector/MapSelector.jsx';

const loadMap = () => {
  const evt = new CustomEvent('LOAD_MAP');
  window.dispatchEvent(evt);
};

class MapShowcaser extends Component {
  constructor() {
    super();
    this.handleMapLoaded = this.handleMapLoaded.bind(this);
    this.handleMapChoice = this.handleMapChoice.bind(this);
  }

  handleMapLoaded() {
    this.props.dispatch(mapLoaded());
  }

  handleMapChoice(optionData, nodeId) {
    const { dispatch } = this.props;

    dispatch(prepareMapLoad(nodeId, optionData));
    // timeouts are for staggering animations,
    // need to set up a special way to cause instant transitions
    setTimeout(() => {
      dispatch(toggleSelectorOpen());
    }, 300);
    setTimeout(() => {
      loadMap();
    }, 500);
  }

  render() {
    const { handlingMapChoice, chosenId, onBoarding, chosenOptionData } = this.props;
    const { handleMapChoice, handleMapLoaded } = this;
    return (
      <div className="mapShowcaser">
        <LoadingPane active={handlingMapChoice} />
        <div className="mapSelector-container">
          <MapSelector
            handleMapChoice={handleMapChoice} chosenId={chosenId}
            mapStyles={mapStyles} onBoarding={onBoarding}
          />
        </div>
        <ReactMap
          handleMapLoaded={handleMapLoaded} chosenOptionData={chosenOptionData}
          onBoarding={onBoarding}
        />
      </div>
    );
  }
}

MapShowcaser.propTypes = {
  dispatch: PropTypes.func.isRequired,
  chosenId: PropTypes.string.isRequired,
  handlingMapChoice: PropTypes.bool.isRequired,
  onBoarding: PropTypes.bool.isRequired,
  chosenOptionData: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  chosenId: state.showcase.chosenId,
  handlingMapChoice: state.showcase.handlingMapChoice,
  selectorOpen: state.showcase.selectorOpen,
  onBoarding: state.showcase.onBoarding,
  chosenOptionData: state.showcase.chosenOptionData,
});

export default connect(
  mapStateToProps,
)(MapShowcaser);
