import React, { Component } from 'react';
import './MBCredits.styl';

import { VelocityTransitionGroup } from 'velocity-react';

class MBCredits extends Component {
  constructor(props){
    super();
    this.state = {
      hover: false
    }
    this.revealCredits = this.revealCredits.bind(this);
    this.hideCredits = this.hideCredits.bind(this);
  }

  revealCredits(){
    this.setState({
      hover: true
    });
  }

  hideCredits(){
    this.setState({
      hover: false
    });
  }

  render() {
    return (
      <div className="mBCredits"
           onMouseEnter={this.revealCredits}
           onMouseLeave={this.hideCredits}
           >
        <VelocityTransitionGroup
          className='velocityTransitionGroup'
          enter={{animation: "transition.slideRightIn", duration: 50}}
          leave={{animation: "transition.slideRightOut", duration: 50}}
        >
        {this.state.hover
          ? (
              <div className='mBCredits-creditsDrawer'
              >
                <a href={'http://www.mimio.io/'} target='_blank'>
                  <span className='mBCredit mBCredits-openstreet'>
                    Mimio
                  </span>
                </a>
                <a href={'http://www.openstreetmap.org/about/'} target='_blank'>
                  <span className='mBCredit mBCredits-openstreet'>
                    <span className='fa fa-copyright' />
                    OpenStreetMap
                  </span>
                </a>
                <a href={'https://www.mapbox.com/about/maps/'} target='_blank'>
                  <span className='mBCredit mBCredits-mapbox'>
                    <span className='fa fa-copyright' />
                    Mapbox
                  </span>
                </a>
                <a href={`https://www.mapbox.com/map-feedback/#/${window.mapMetrics.center.lng}/${window.mapMetrics.center.lat}/${window.mapMetrics.zoom}`}
                   target='_blank'>
                  <span className='mBCredit mBCredits-improveMap'>
                    Improve this map
                  </span>
                </a>
              </div>
            )
          : null
        }
        </VelocityTransitionGroup>
        <div className='mBCredits-button'>
          <span className='mBCredits-button-icon fa fa-info' />
        </div>
      </div>
    );
  }

}

export default MBCredits;