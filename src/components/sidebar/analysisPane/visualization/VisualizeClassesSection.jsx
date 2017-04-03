import './VisualizeClassesSection.styl';
import React from 'react';
import ClassesVisualizer from './ClassesVisualizer.jsx';
import { guid } from '../../../../utils/generalUtils.jsx';
import { convertPropsMetadataToDrodownObject, updateActiveFields } from '../analysisUtils.jsx';
import { constructVisEventData, visEventsAreDifferent } from './visUtils.jsx';
import { splitRangeByClasses } from '../../../../filter/filterUtils.jsx';
import { splitsToSliderValues, sliderValuesToSplits } from './classesVisUtils.jsx';
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
    this.state = {
      visualizerIds: [this.id],
      resetClicked: false
    }
    this.updateVisSettingMemory = this.updateVisSettingMemory.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentDidMount(){
    if (this.props.visualizerSwitch || firstDraw){
      console.log('sending vis event from componentDidMount')
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
    if ( !visState.freezeValidity ) {
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
  
  handleReset(){
    const { stepMin, stepMax, classNumValue } = memory.visSetting;
    const splits = splitRangeByClasses([stepMin, stepMax], classNumValue);
    const splitVals = splitsToSliderValues(splits);
    memory.visSetting.selectedRange = splitVals;
    memory.visSetting.selectedSplitRanges = splits;
    this.setState({
      visualizerIds: [this.id],
      resetClicked: true
    });
    window.setTimeout(() => {
      this.setState({
        resetClicked: false
      });
    }, 500);
  }

  render() {
    return (
      <div className="visualizeClassesSection section">
        <div className='visContainer'>
          {this.renderVisualizer(this.state.visualizerIds)}
          <div className="visClassesControls"> 
            <div className={"visClassesControls-resetButton visClassesControls-resetButton-" + (this.state.resetClicked ? 'clicked' : 'notClicked')} onClick={this.handleReset}>
              <span className="visClassesControls-resetButton-text"><span className="fa fa-rotate-left visClassesControls-resetButton-icon" />Reset</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderVisualizer(visualizer){
    const nodes = visualizer.map((visId, i) => {
      return <ClassesVisualizer key={i} ref={visId} id={visId} 
                                memory={memory.visSetting} dropdownData={this.dropdownData} propsMd={this.props.propsMd}
                                updateVisSettingMemory={this.updateVisSettingMemory} />
    });
    return nodes;
  }
}

 export default VisualizeClassesSection;
