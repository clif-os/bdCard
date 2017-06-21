import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './MapSplitter.styl';
import { splitMap } from '../../actions/index.jsx';

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
    this.setState({
      buttonHover: 'unhover',
      buttonPress: 'unpress',
    });
  }
  pressButton() {
    this.setState({ buttonPress: 'press' });
  }
  unpressButton() {
    this.setState({ buttonPress: 'unpress' });
  }

  splitMap() {
    this.props.dispatch(splitMap());
  }

  render() {
    const { buttonHover, buttonPress } = this.state;
    const { tooltip } = this.props;
    return (
      <div className="mapSplitter-container">
        <div className="mapSplitter">
          <div className={`mapSplitter-tooltip mapSplitter-tooltip-${tooltip}`}>
            <span className="mapSplitter-tooltip-text">
              <span className="fa fa-info-circle" /> Click To Compare Basemaps
            </span>
          </div>
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
  tooltip: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  tooltip: state.tooltips.mapSplitter,
});

export default connect(mapStateToProps)(MapSplitter);
