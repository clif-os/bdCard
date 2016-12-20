import React, { Component } from 'react';
import SelectionPaneContent from './SelectionPaneContent.jsx';
import { VelocityTransitionGroup } from 'velocity-react';
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
        <div className="paneSpacerHorizontal" />
        <VelocityTransitionGroup
            component="div"
            enter={{ animation: 'slideDown', duration: 100 }}
            leave={{ animation: 'slideUp', duration: 100 }}
            >
        {(this.state.featureSelected
          ? <SelectionPaneContent selectedFeature={this.state.selectedFeature} />
          : null
        )}
        </ VelocityTransitionGroup>
        <div className="paneSpacerHorizontal" />
      </div>
    )
  }
}

export default selectionPane;

//<div className="paneSpacerHorizontal" />
// selectedFeature={this.state.selectedFeature}