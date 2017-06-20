import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './MapSelector.styl';
import { toggleSelectorOpen } from '../../../actions/index.jsx';
import MapOption from './MapOption.jsx';

const renderOptions = (options, handleChoice, chosenOptionsIds,
                       showcaseId, optionSize, containerSize) => {
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
        optionSize={optionSize} containerSize={containerSize}
      />
    );
  });
  return (
    <div className="mapOptions-container">
      {nodes}
    </div>
  );
};

const determineOptionSize = (showcaseId) => {
  const className = `mapOption-${showcaseId}`;
  const child = document.getElementsByClassName(className)[0];
  const width = child.clientWidth;
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

class MapSelector extends Component {
  constructor() {
    super();
    this.state = {
      optionSize: 'large',
    };
    this.toggleSelectorOpen = this.toggleSelectorOpen.bind(this);
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
    const newSize = determineOptionSize(showcaseId);
    if (size !== newSize) {
      this.setState({ optionSize: newSize });
    }
  }

  toggleSelectorOpen() {
    const { showcaseId } = this.props;
    this.props.dispatch(toggleSelectorOpen(showcaseId));
  }

  render() {
    const { open, handleMapChoice, chosenOptionsIds,
            mapStyles, onBoarding, containerSize, showcaseId } = this.props;
    const { optionSize } = this.state;
    const icon = open ? 'close' : 'paint-brush';
    return (
      <div className={`mapSelector mapSelector-open-${open} mapSelector-${containerSize}`}>
        {onBoarding
          ? null
          : <button className="mapSelector-button bms-button" onClick={this.toggleSelectorOpen} >
            <span className={`mapSelector-button-icon fa fa-${icon}`} />
          </button>
        }
        {renderOptions(mapStyles, handleMapChoice,
                       chosenOptionsIds, showcaseId, optionSize, containerSize)}
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

export default connect()(MapSelector);
