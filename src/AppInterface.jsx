import './AppInterface.styl';
import React from 'react';
import Sidebar from './components/sidebar/Sidebar.jsx';
import Legend from './components/legend/Legend.jsx';
import MBFullExtentButton from './components/customMapboxControls/MBFullExtentButton.jsx';

class AppInterface extends React.Component {
  constructor(props){
    super();
    this.state = {
      mapLoaded: false
    };
    document.addEventListener('MAP_LOADED', this.handleMapLoad.bind(this));
  }

  handleMapLoad(){
    const loadingPane = document.getElementById('mainLoadingPane');
    loadingPane.style.opacity = '0';
    window.setTimeout(() => {
      loadingPane.style.display = 'none';
    }, 500);
  }

  render() {
    return (
      <div className="AppInterface">
        <Sidebar propsMd={this.props.propsMd} />
        <Legend legendData={this.props.legendData} />
        <MBFullExtentButton />
      </div>
    );
  }
}
 export default AppInterface;