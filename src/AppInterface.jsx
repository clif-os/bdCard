import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './AppInterface.styl';
import './styles/general.styl';
import MapShowcaser from './components/mapShowcaser/MapShowcaser.jsx';
import MapSplitter from './components/showcaseControls/MapSplitter.jsx';

global.mapboxgl = require('mapbox-gl');

mapboxgl.accessToken = 'pk.eyJ1IjoibWltaW8iLCJhIjoiY2l6ZjJoenBvMDA4eDJxbWVkd2IzZjR0ZCJ9.ppwGNP_-LS2K4jUvgXG2pA';

const handleAppLoad = () => {
  const loadingPane = document.getElementById('primaryLoadingPane');
  loadingPane.classList.add('loadingPane-inactive');
  loadingPane.classList.remove('loadingPane-active');
  window.setTimeout(() => {
    loadingPane.style.display = 'none';
  }, 500);
};

// resizing logic needs to be started

class AppInterface extends Component {

  componentDidMount() {
    setTimeout(() => {
      handleAppLoad();
    }, 1500);
  }

  render() {
    const { mapSplit, showcase1, showcase2, chosenOptionsIds, primaryShowcase } = this.props;
    let pShowcase;
    if (primaryShowcase === 'showcase1') {
      pShowcase = { ...showcase1 };
    } else if (primaryShowcase === 'showcase2') {
      pShowcase = { ...showcase2 };
    }
    return (
      <div className="AppInterface">
        {mapSplit
          ? <div className="showcase-masterContainer">
            <div className="showcase1-container">
              <MapShowcaser
                showcaseId={'showcase1'}
                chosenOptionsIds={chosenOptionsIds} handlingMapChoice={showcase1.handlingMapChoice}
                selectorOpen={showcase1.selectorOpen} onBoarding={showcase1.onBoarding}
                chosenOptionData={showcase1.chosenOptionData} mapSplit={mapSplit}
              />
            </div>
            <div className="showcase2-container">
              <MapShowcaser
                showcaseId={'showcase2'}
                chosenOptionsIds={chosenOptionsIds} handlingMapChoice={showcase2.handlingMapChoice}
                selectorOpen={showcase2.selectorOpen} onBoarding={showcase2.onBoarding}
                chosenOptionData={showcase2.chosenOptionData} mapSplit={mapSplit}
              />
            </div>
          </div>
          : <div className="showcase-masterContainer">
            <MapShowcaser
              showcaseId={primaryShowcase}
              chosenOptionsIds={chosenOptionsIds} handlingMapChoice={pShowcase.handlingMapChoice}
              selectorOpen={pShowcase.selectorOpen} onBoarding={pShowcase.onBoarding}
              chosenOptionData={pShowcase.chosenOptionData} mapSplit={mapSplit}
            />
            <MapSplitter />
          </div>
        }
      </div>
    );
  }
}

AppInterface.propTypes = {
  mapSplit: PropTypes.bool.isRequired,
  showcase1: PropTypes.object.isRequired,
  showcase2: PropTypes.object.isRequired,
  chosenOptionsIds: PropTypes.object.isRequired,
  primaryShowcase: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  mapSplit: state.showcase.mapSplit,
  showcase1: state.showcase.showcase1,
  showcase2: state.showcase.showcase2,
  chosenOptionsIds: state.showcase.chosenOptionsIds,
  primaryShowcase: state.showcase.primaryShowcase,
});

export default connect(
  mapStateToProps,
)(AppInterface);

