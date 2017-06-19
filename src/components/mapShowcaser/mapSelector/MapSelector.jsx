import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './MapSelector.styl';
import { toggleSelectorOpen } from '../../../actions/index.jsx';
import MapOption from './MapOption.jsx';

const renderOptions = (options, handleChoice, chosenOptionsIds) => {
  const nodes = options.map((option, i) => {
    const { title, description, img } = option;
    const { url } = img;
    const key = i;
    const chosenIds = Object.values(chosenOptionsIds);
    return (
      <MapOption
        key={key} handleChoice={handleChoice}
        title={title} description={description} imgUrl={url}
        optionId={title}
        optionData={option} chosen={chosenIds.indexOf(title) > -1}
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
  }

  toggleSelectorOpen() {
    const { showcaseId } = this.props;
    this.props.dispatch(toggleSelectorOpen(showcaseId));
  }

  render() {
    const { handleMapChoice, chosenOptionsIds, mapStyles, onBoarding } = this.props;
    const { open } = this.props;
    const icon = open ? 'close' : 'paint-brush';
    return (
      <div className={`mapSelector mapSelector-open-${open}`}>
        {onBoarding
          ? null
          : <button className="mapSelector-button bms-button" onClick={this.toggleSelectorOpen} >
            <span className={`mapSelector-button-icon fa fa-${icon}`} />
          </button>
        }
        {renderOptions(mapStyles, handleMapChoice, chosenOptionsIds)}
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
};

export default connect()(MapSelector);
