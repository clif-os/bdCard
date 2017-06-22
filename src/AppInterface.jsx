import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './AppInterface.styl';

import { handleAppResize } from './utils/resizer.jsx';

import { incrementColor } from './actions/index.jsx';

// const handleAppLoad = () => {
//   const loadingPane = document.getElementById('primaryLoadingPane');
//   loadingPane.classList.add('loadingPane-inactive');
//   loadingPane.classList.remove('loadingPane-active');
//   window.setTimeout(() => {
//     loadingPane.style.display = 'none';
//   }, 500);
// };

class AppInterface extends Component {

  componentDidMount() {
    // setTimeout(() => {
    //   handleAppLoad();
    // }, 1500);
    handleAppResize();
    window.addEventListener('resize', handleAppResize.bind(this));
    setInterval(() => {
      this.props.dispatch(incrementColor());
    }, 2000);
  }

  render() {
    const { colorIndex } = this.props;
    return (
      <div className={`appInterface appInterface-colorIndex-${colorIndex}`}>
        
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

