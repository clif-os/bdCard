import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './AppInterface.styl';

import { handleAppResize } from './utils/resizer.jsx';

import { incrementColor } from './actions/index.jsx';

class AppInterface extends Component {

  componentDidMount() {
    handleAppResize();
    window.addEventListener('resize', handleAppResize.bind(this));
    setInterval(() => {
      this.props.dispatch(incrementColor());
    }, 2000);
    const audio = new Audio('bling.mp3');
    audio.play();
  }

  render() {
    const { colorIndex } = this.props;
    return (
      <div className={`appInterface appInterface-colorIndex-${colorIndex}`}>
        <div className="gif-container">
          <img src="https://media.giphy.com/media/26BkNIqbzQIXdUi08/giphy.gif" alt="drakie mon" />
        </div>
        <div className="repeatingText" />
      </div>
    );
  }
}

AppInterface.propTypes = {
  dispatch: PropTypes.func.isRequired,
  colorIndex: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  colorIndex: state.colors.colorIndex,
});

export default connect(
  mapStateToProps,
)(AppInterface);

