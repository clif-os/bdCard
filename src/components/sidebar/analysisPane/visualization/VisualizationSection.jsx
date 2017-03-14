import './VisualizationSection.styl';
import React from 'react';
import Visualizer from './Visualizer.jsx';
import { guid } from '../../../../utils/generalUtils.jsx';
import { convertPropsMetadataToDrodownObject, mergeAllActiveFields } from '../analysisUtils.jsx';
import { constructVisEventData, visEventsAreDifferent } from './visUtils.jsx';
import { VelocityTransitionGroup } from 'velocity-react';

// consider https://www.npmjs.com/package/react-color

// VISUALIZER MEMORY
var memory = {
  visSetting: {},
  lastVisEventData: null,
  firstDraw: true
};

class VisualizationSection extends React.Component {
  constructor(props){
    super();
    this.dropdownData = Object.assign({}, convertPropsMetadataToDrodownObject(props.propsMd));
    this.id = guid();
    this.state = {
      showingPane: false
    }
    this.updateVisSettingMemory = this.updateVisSettingMemory.bind(this);
  }

  componentDidMount(){
    this.setState({
      showingPane: true
    })
  }

  buildPropLabel(setting){
    if (Object.keys(setting).length === 0){
      return null;
    }
    const fieldLabel = setting.fieldLabel;
    const yearLabel = setting.yearLabel;
    return fieldLabel + ' ' + yearLabel;
  };

  updateActiveFields(setting){
    // this will need to be refactored eventually;
    window.activeVisFields = {};
    const propLabel = this.buildPropLabel(setting);
    const selectedProp = setting.selectedProp;
    window.activeVisFields[selectedProp] = propLabel;
    mergeAllActiveFields();
  };

  updateVisSettingMemory(visId, visState){
    memory.visSetting = visState;
    this.updateActiveFields(memory.visSetting);
    if (memory.firstDraw){
      memory.firstDraw = false;
      memory.lastVisEventData = window.defaultVisEvent;
      return;
    };
    if ( !visState.freezeVisValidity ) {
      this.determineVisEventFire();
    };
    
  }

  determineVisEventFire(){
    const visEventData = constructVisEventData(memory.visSetting);
    if (!memory.visSetting.visActive && (memory.visSetting.visActive !== memory.lastVisEventData.visActive)){
      const unvisualize = new CustomEvent('UNVISUALIZE')
      document.dispatchEvent(unvisualize);
    } else if (visEventsAreDifferent(memory.lastVisEventData, visEventData) && memory.visSetting.visActive){
      const visualize = new CustomEvent('VISUALIZE', {'detail': visEventData})
      document.dispatchEvent(visualize);
    }
    memory.lastVisEventData = visEventData;
  }

  render() {
    return (
      <div className="visualizationSection section">
        <div className='header'>
          <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{animation: "transition.slideLeftIn", duration: this.props.transitionDuration}}
            leave={{animation: "transition.slideLeftOut", duration: this.props.transitionDuration}}
          >
            {this.state.showingPane
              ? <span className='header-title'>Visualization Settings</span>
              : null
            }
          </VelocityTransitionGroup>
        </div>
        <div className='visContainer'>
          <Visualizer id={this.id} memory={memory.visSetting} dropdownData={this.dropdownData} updateVisSettingMemory={this.updateVisSettingMemory} propsMd={this.props.propsMd} />
        </div>
      </div>
    );
  }
}

 export default VisualizationSection;
