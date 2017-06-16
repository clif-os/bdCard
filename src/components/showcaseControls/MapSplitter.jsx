import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './MapSplitter.styl';
import { mapSplit } from '../../actions/index.jsx';

class MapSplitter extends Component {
  constructor() {
    super();
    this.state = {
      buttonHover: 'unhover',
      buttonPress: 'unpress',
    };
    this.hoverButton = this.hoverButton.bind(this);
    this.unhoverButton = this.unhoverButton.bind(this);
    this.pressButton = this.pressButton.bind(this);
    this.unpressButton = this.unpressButton.bind(this);
    this.splitMap = this.splitMap.bind(this);
  }

  hoverButton() {
    this.setState({ buttonHover: 'hover' });
  }
  unhoverButton() {
    this.setState({ buttonHover: 'unhover' });
  }
  pressButton() {
    this.setState({ buttonPress: 'press' });
  }
  unpressButton() {
    this.setState({ buttonPress: 'unpress' });
  }

  splitMap() {
    this.props.dispatch(mapSplit());
  }

  render() {
    const { buttonHover, buttonPress } = this.state;
    return (
      <div className="mapSplitter-container">
        <div className="mapSplitter">
          <button
            className="mapSplitter-button bms-button"
            onMouseOver={this.hoverButton}
            onMouseOut={this.unhoverButton}
            onMouseDown={this.pressButton}
            onMouseUp={this.unpressButton}
            onClick={this.splitMap}
          >
            <span className="mapSplitter-button-icon fa fa-scissors" />
          </button>
          <div
            className={`mapSplitter-dividerPreview
                        mapSplitter-dividerPreview-${buttonHover}
                        mapSplitter-dividerPreview-${buttonPress}`}
          />
        </div>
      </div>
    );
  }
}

MapSplitter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mapSplit: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  mapSplit: state.showcase.mapSplit,
});

export default connect(
  mapStateToProps,
)(MapSplitter);
