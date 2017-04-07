import './AppInterface.styl';
import React from 'react';
import Sidebar from './components/sidebar/Sidebar.jsx';
import Legend from './components/legend/Legend.jsx';
import MBFullExtentButton from './components/customMapboxControls/MBFullExtentButton.jsx';
import MBCredits from './components/customMapboxControls/MBCredits.jsx';

class AppInterface extends React.Component {
  constructor(props){
    super();
    this.state = {
      mapLoaded: false
    };
    document.addEventListener('MAP_LOADED', this.handleMapLoad.bind(this));
    this.handleMapLoad = this.handleMapLoad.bind(this);
  }

  handleMapLoad(){
    this.setState({
      mapLoaded: true
    });
    const loadingPane = document.getElementById('mainLoadingPane');
    loadingPane.style.opacity = '0';
    window.setTimeout(() => {
      loadingPane.style.display = 'none';
    }, 500);
  }

  render() {
    return (
      <div className="AppInterface">
        {this.state.mapLoaded
          ? (
            <div>
              <Sidebar propsMd={this.props.propsMd} />
              <Legend legendData={this.props.legendData} />
              <MBFullExtentButton />
              <MBCredits />
            </div>
          )
          : null        
        }
      </div>
    );
  }
}
 export default AppInterface;