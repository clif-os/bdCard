import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleSelectorOpen, prepareMapLoad, mapLoaded } from '../../actions/index.jsx';
import './MapShowcaser.styl';
import ReactMap from './map/ReactMap.jsx';
import { mapStyles } from './map/mapStyle_data.jsx';
import LoadingPane from './loader/LoadingPane.jsx';
import MapSelector from './mapSelector/MapSelector.jsx';
import CloseButton from './CloseButton.jsx';

const loadMap = (showcaseId) => {
  const evt = new CustomEvent(`LOAD_MAP_${showcaseId}`);
  window.dispatchEvent(evt);
};

const determineSize = (showcaseId) => {
  const id = `mapShowcaser-${showcaseId}`;
  const container = document.getElementById(id);
  const width = container.clientWidth;
  if (width <= 325) {
    return 'extraSmall';
  } else if (width > 325 && width < 600) {
    return 'small';
  } else if (width >= 600 && width < 800) {
    return 'medium';
  } else if (width >= 800) {
    return 'large';
  }
  return 'large';
};

class MapShowcaser extends Component {
  constructor() {
    super();
    this.state = {
      size: 'large',
    };
    this.handleMapLoaded = this.handleMapLoaded.bind(this);
    this.handleMapChoice = this.handleMapChoice.bind(this);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
  handleResize() {
    const { showcaseId } = this.props;
    const { size } = this.state;
    const newSize = determineSize(showcaseId);
    if (size !== newSize) {
      this.setState({ size: newSize });
    }
  }

  handleMapLoaded() {
    const { showcaseId } = this.props;
    this.props.dispatch(mapLoaded(showcaseId));
  }

  handleMapChoice(optionId, optionData) {
    const { showcaseId } = this.props;
    const { dispatch } = this.props;
    dispatch(prepareMapLoad(showcaseId, optionId, optionData));
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
    const { showcaseId, handlingMapChoice, chosenOptionsIds,
            onBoarding, chosenOptionData, selectorOpen, mapSplit } = this.props;
    const { handleMapChoice, handleMapLoaded } = this;
    const { size } = this.state;
    return (
      <div className="mapShowcaser" id={`mapShowcaser-${showcaseId}`}>
        <LoadingPane active={handlingMapChoice} />
        <CloseButton mapSplit={mapSplit} showcaseId={showcaseId} containerSize={size} />
        <div className="mapSelector-container">
          <MapSelector
            showcaseId={showcaseId}
            handleMapChoice={handleMapChoice} chosenOptionsIds={chosenOptionsIds}
            mapStyles={mapStyles} onBoarding={onBoarding} open={selectorOpen} containerSize={size}
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
  mapSplit: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  chosenOptionsIds: PropTypes.object.isRequired,
  handlingMapChoice: PropTypes.bool.isRequired,
  onBoarding: PropTypes.bool.isRequired,
  chosenOptionData: PropTypes.object.isRequired,
  selectorOpen: PropTypes.bool.isRequired,
};

export default connect()(MapShowcaser);
