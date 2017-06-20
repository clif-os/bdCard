import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './MapSelector.styl';
import { toggleSelectorOpen, registerResponsiveElement, unregisterResponsiveElement } from '../../../actions/index.jsx';
import MapOption from './MapOption.jsx';

const classifier = (className) => {
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
const defaultClass = 'medium';

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

class MapSelector extends Component {
  constructor() {
    super();
    this.toggleSelectorOpen = this.toggleSelectorOpen.bind(this);
    this.optionSize = defaultClass;
  }
  componentDidMount() {
    const { showcaseId, dispatch } = this.props;
    const className = `mapOption-${showcaseId}`;
    dispatch(registerResponsiveElement(className, classifier, defaultClass));
  }
  componentWillUnmount() {
    const { showcaseId, dispatch } = this.props;
    const className = `mapOption-${showcaseId}`;
    dispatch(unregisterResponsiveElement(className));
  }
  componentDidUpdate() {
    const { showcaseId, responsive } = this.props;
    const className = `mapOption-${showcaseId}`;
    const optionSize = responsive[className].class;
    const actualClass = classifier(className);
    console.log({ optionSize }, { actualClass })
  }

  toggleSelectorOpen() {
    const { showcaseId } = this.props;
    this.props.dispatch(toggleSelectorOpen(showcaseId));
  }

  render() {
    const { open, handleMapChoice, chosenOptionsIds,
            mapStyles, onBoarding, containerSize, showcaseId, responsive } = this.props;
    this.optionSize = responsive[`mapOption-${showcaseId}`] ? responsive[`mapOption-${showcaseId}`].class : defaultClass;
    const icon = open ? 'close' : 'paint-brush';
    return (
      <div className={`mapSelector mapSelector-open-${open} mapSelector-${containerSize}`} >
        {onBoarding
          ? null
          : <button className="mapSelector-button bms-button" onClick={this.toggleSelectorOpen} >
            <span className={`mapSelector-button-icon fa fa-${icon}`} />
          </button>
        }
        {renderOptions(mapStyles, handleMapChoice,
                       chosenOptionsIds, showcaseId, this.optionSize, containerSize)}
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
  responsive: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  responsive: state.responsive,
});

export default connect(mapStateToProps)(MapSelector);
