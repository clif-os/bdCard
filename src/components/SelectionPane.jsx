import React, { Component } from 'react';
import SelectionTable from './SelectionTable.jsx'; 
import './SelectionPane.styl';

class selectionPane extends Component {
  constructor(props){
    super();
    this.state = {
      selectedFeature: {},
      featureSelected: false
    }
    this.handleFeatureClick = this.handleFeatureClick.bind(this);
    document.addEventListener('FEATURE_CLICKED', this.handleFeatureClick);
    this.handleNonFeatureClick = this.handleNonFeatureClick.bind(this);
    document.addEventListener('NONFEATURE_CLICKED', this.handleNonFeatureClick);
  }

  handleFeatureClick(){
    this.setState({
      selectedFeature: window.selectedFeature,
      featureSelected: true
    })
    console.log(this.state.selectedFeature);
  }

  handleNonFeatureClick(){
    this.setState({
      selectedFeature: {},
      featureSelected: false
    })
  }

  render() {
    return(
      <div className="selectionPane">
        {(this.state.featureSelected
          ? <SelectionTable selectedFeature={this.state.selectedFeature} />
          : null
        )}
      </div>
    )
  }
}

export default selectionPane;

//<div className="paneSpacerHorizontal" />
