import React, { Component } from 'react';
import './AppInterface.styl';
import MapShowcaser from './components/mapShowcaser/MapShowcaser.jsx';

const handleAppLoad = () => {
  const loadingPane = document.getElementById('primaryLoadingPane');
  loadingPane.classList.add('loadingPane-inactive');
  loadingPane.classList.remove('loadingPane-active');
  window.setTimeout(() => {
    loadingPane.style.display = 'none';
  }, 500);
};

class AppInterface extends Component {

  componentDidMount() {
    setTimeout(() => {
      handleAppLoad();
    }, 1500);
  }

  render() {
    return (
      <div className="AppInterface">
        <MapShowcaser />
      </div>
    );
  }
}

export default AppInterface;
