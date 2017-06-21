import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './MapSelector.styl';
import { toggleSelectorOpen } from '../../../actions/index.jsx';
import MapOption from './MapOption.jsx';

const optionClassifier = (width) => {
  if (width <= 325) {
    return 'extraSmall';
  } else if (width > 325 && width < 450) {
    return 'small';
  } else if (width >= 450 && width < 600) {
    return 'medium';
  } else if (width >= 600) {
    return 'large';
  }
  return 'large';
};

const renderOptions = (options, handleChoice, chosenOptionsIds,
                       showcaseId, classifier, containerSize) => {
  const nodes = options.map((option, i) => {
    const { title, description, img } = option;
    const { url } = img;
    const key = i;
    const chosenIds = Object.values(chosenOptionsIds);
    return (
      <MapOption
        key={key} handleChoice={handleChoice} showcaseId={showcaseId}
        title={title} description={description} imgUrl={url}
        optionId={title}
        optionData={option} chosen={chosenIds.indexOf(title) > -1}
        classifier={classifier} containerSize={containerSize}
      />
    );
  });
  // the spacer allows the header to exist without overlap at first,
  // but also stay present during scrolling
  return (
    <div className={`mapOptions-container mapOptions-container-${containerSize}`}>
      {nodes}
    </div>
  );
};

class MapSelector extends Component {
  constructor() {
    super();
    this.toggleSelectorOpen = this.toggleSelectorOpen.bind(this);
  }

  toggleSelectorOpen() {
    const { showcaseId } = this.props;
    this.props.dispatch(toggleSelectorOpen(showcaseId));
  }

  render() {
    const { open, handleMapChoice, chosenOptionsIds,
            mapStyles, onBoarding, containerSize, showcaseId } = this.props;
    const icon = open ? 'close' : 'paint-brush';
    return (
      <div className={`mapSelector mapSelector-open-${open} mapSelector-${containerSize}`} >
        {onBoarding
          ? null
          : <button className="mapSelector-button bms-button" onClick={this.toggleSelectorOpen} >
            <span className={`mapSelector-button-icon fa fa-${icon}`} />
          </button>
        }
        <div className="mapSelector-collapsableContent-container">
          <div className={`mapSelector-title-container mapSelector-title-container-${containerSize}`}>
            <span className="mapSelector-title">
              <span className="mapSelector-title-icon fa fa-hand-pointer-o" />Pick a Basemap
            </span>
          </div>
          {renderOptions(mapStyles, handleMapChoice,
                        chosenOptionsIds, showcaseId, optionClassifier, containerSize)}
        </div>
      </div>
    );
  }
}

MapSelector.propTypes = {
  showcaseId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  handleMapChoice: PropTypes.func.isRequired,
  chosenOptionsIds: PropTypes.object.isRequired,
  mapStyles: PropTypes.array.isRequired,
  onBoarding: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  containerSize: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  responsive: state.responsive,
});

export default connect(mapStateToProps)(MapSelector);
