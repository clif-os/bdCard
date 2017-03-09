import React, { Component } from 'react';
import './MBFullExtentButton.styl';

class MBFullExtentButton extends Component {
  constructor(props){
    super();
    this.handleFullExtentClick = this.handleFullExtentClick.bind(this);
  }

  handleFullExtentClick() {
    const evt = new CustomEvent('ZOOM_TO_FULL_EXTENT');
    document.dispatchEvent(evt);
  }

  render() {
    return (
      <div className="mBFullExtentButton"
           onClick={this.handleFullExtentClick}
           >
        <span className="fa fa-arrows-alt" />
      </div>
    );
  }

}


export default MBFullExtentButton;