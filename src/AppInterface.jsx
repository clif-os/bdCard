import './AppInterface.styl';
import React from 'react';
import MainLoadingPane from './components/loadingPanes/MainLoadingPane.jsx';
import Sidebar from './components/sidebar/Sidebar.jsx';

import { VelocityTransitionGroup } from 'velocity-react';

class AppInterface extends React.Component {
  constructor(props){
    super();
    this.state = {
      mapLoaded: false
    };
    document.addEventListener('MAP_LOADED', this.handleMapLoad.bind(this));
  }

  handleMapLoad(){
    this.setState({
      mapLoaded: true
    });
  }

  render() {
    return (
      <div className="AppInterface">
        <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{animation: "transition.slideDownIn", duration: 500}}
            leave={{animation: "transition.slideDownOut", duration: 500}}
          >
            {this.state.mapLoaded
              ? null
              : (<MainLoadingPane />) 
            }
        </VelocityTransitionGroup>
        <Sidebar propsMd={this.props.propsMd} />
      </div>
    );
  }
}
 export default AppInterface;