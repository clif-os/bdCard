import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './AppInterface.styl';

import { Howl } from 'howler';

import { handleAppResize } from './utils/resizer.jsx';

import { incrementColor } from './actions/index.jsx';

class AppInterface extends Component {

  componentDidMount() {
    handleAppResize();
    window.addEventListener('resize', handleAppResize.bind(this));
    const sound = new Howl({
      src: ['bling.mp3'],
      loop: true,
      volume: 0.6,
    });
    sound.once('load', () => {
      setInterval(() => {
        this.props.dispatch(incrementColor());
      }, 2000);
      sound.play();
    });
  }

  render() {
    const { colorIndex, musicLoaded } = this.props;
    return (
      <div className={`appInterface appInterface-colorIndex-${colorIndex}`}>
        <div id="appInterface-loader" className={`appInterface-loader-${musicLoaded}`} >
          <img id="appInterface-loader-spinner" src="http://i.imgur.com/04EKlQJ.png" alt="issa party" />
          <span id="appInterface-loader-text">Loading Tings and Badmons...</span>
        </div>
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
  musicLoaded: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  colorIndex: state.colors.colorIndex,
  musicLoaded: state.loaders.musicLoaded,
});

export default connect(
  mapStateToProps,
)(AppInterface);

