import './MapboxButtons.styl';
import MBFullExtentButton from './MBFullExtentButton.jsx';
import React from 'react';

class AppInterface extends React.Component {
  constructor(props) {
    super();
    this.handleFullExtentClick = this.handleFullExtentClick.bind(this);
  }

  handleFullExtentClick(){
    const evt = new CustomEvent('RESET_BOUNDS');
    document.dispatchEvent(evt);
  }

  render() {
    return (
      <div className="mapboxButtons">
        <MBFullExtentButton onClick={this.handleFullExtentClick}/>
      </div>
    );
  }
}
 export default AppInterface;