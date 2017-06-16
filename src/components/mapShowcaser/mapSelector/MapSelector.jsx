import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './MapSelector.styl';
import { toggleSelectorOpen } from '../../../actions/index.jsx';
import MapOption from './MapOption.jsx';

const renderOptions = (options, handleChoice, chosenId) => {
  const nodes = options.map((option, i) => {
    const { title, description, img } = option;
    const { url } = img;
    const nodeId = i + 1;
    return (
      <MapOption
        key={i} nodeId={nodeId} handleChoice={handleChoice}
        title={title} description={description} imgUrl={url}
        optionData={option} chosen={nodeId === chosenId}
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
  constructor(props) {
    super();
    this.toggleSelectorOpen = this.toggleSelectorOpen.bind(this);
  }

  toggleSelectorOpen() {
    this.props.dispatch(toggleSelectorOpen());
  }

  render() {
    const { handleMapChoice, chosenId, mapStyles, onBoarding } = this.props;
    const { open } = this.props;
    const icon = open ? 'close' : 'paint-brush';
    return (
      <div className={`mapSelector mapSelector-open-${open}`}>
        {onBoarding
          ? null
          : <button className="mapSelector-button" onClick={this.toggleSelectorOpen} >
            <span className={`mapSelector-button-icon fa fa-${icon}`} />
          </button>
        }
        {renderOptions(mapStyles, handleMapChoice, chosenId)}
      </div>
    );
  }
}

MapSelector.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleMapChoice: PropTypes.func.isRequired,
  // chosenId: PropTypes.number.isRequired,
  mapStyles: PropTypes.array.isRequired,
  onBoarding: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  open: state.showcase.selectorOpen,
});

export default connect(
  mapStateToProps,
)(MapSelector);
