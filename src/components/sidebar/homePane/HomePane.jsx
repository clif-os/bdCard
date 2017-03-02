import './HomePane.styl';
import React from 'react';

class HomePane extends React.Component {
  constructor(props){
    super();
  }

  render() {
    return (
      <div className="homePane sidebarPane">
        <div className='homeWatermark-container'>
          <span className='fa fa-home' />
        </div>
      </div>
    );
  }
}
 export default HomePane;