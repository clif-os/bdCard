import './VisualizeClassesSection.styl';
import React from 'react';
import ClassesVisualizer from './ClassesVisualizer.jsx';
import { guid } from '../../../../utils/generalUtils.jsx';
import { convertPropsMetadataToDrodownObject, updateActiveFields } from '../analysisUtils.jsx';
import { constructVisEventData, visEventsAreDifferent } from './visUtils.jsx';

// consider https://www.npmjs.com/package/react-color

// VISUALIZER MEMORY
var memory = {
  // visSetting: {},
  // lastVisEventData: null,
  // firstDraw: true
};

var firstDraw = true;

class VisualizeClassesSection extends React.Component {
  constructor(props){
    super();
    memory = props.memory;
    this.dropdownData = Object.assign({}, convertPropsMetadataToDrodownObject(props.propsMd));
    this.id = guid();
    this.updateVisSettingMemory = this.updateVisSettingMemory.bind(this);
  }

  componentDidMount(){
    if (this.props.visualizerSwitch || firstDraw){
      firstDraw = false;
      const visEventData = constructVisEventData(memory.visSetting);
      const visualize = new CustomEvent('VISUALIZE_CLASSES', {'detail': visEventData});
      document.dispatchEvent(visualize);
    }
  }

  updateVisSettingMemory(visId, visState){
    memory.visSetting = visState;
    updateActiveFields('classes', memory.visSetting);
    if (memory.firstDraw){
      memory.firstDraw = false;
      memory.lastVisEventData = window.defaultVisEvent;
      return;
    };
    if ( !visState.freezeVisValidity ) {
      this.determineVisEventFire();
    };
    this.props.updateVisualizersMemory('classes', memory);
  }

  determineVisEventFire(){
    const visEventData = constructVisEventData(memory.visSetting);
    if (visEventsAreDifferent(memory.lastVisEventData, visEventData)){
      const deselect = new CustomEvent('DESELECT_FEATURE');
      document.dispatchEvent(deselect);
      const visualize = new CustomEvent('VISUALIZE_CLASSES',
        {'detail': visEventData }
      )
      document.dispatchEvent(visualize);
    }
    memory.lastVisEventData = visEventData;
  }

  render() {
    return (
      <div className="visualizeClassesSection section">
        <div className='visContainer'>
          <ClassesVisualizer id={this.id} memory={memory.visSetting} dropdownData={this.dropdownData} updateVisSettingMemory={this.updateVisSettingMemory} propsMd={this.props.propsMd} />
        </div>
      </div>
    );
  }
}

 export default VisualizeClassesSection;
