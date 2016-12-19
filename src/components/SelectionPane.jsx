import React, { Component } from 'react';
import './selectionPane.styl';

class selectionPane extends Component {
  constructor(props){
    super();
    this.handleFeatureClick = this.handleFeatureClick.bind(this);
    document.addEventListener('FEATURE_CLICKED', this.handleFeatureClick());
  }

  handleFeatureClick(){
    console.log(window.selectedFeature);
  }

  render() {
    return(
      <div className="selectionPane">
        <div className="paneSpacerHorizontal" />
      </div>
    )
  }
}

export default selectionPane;