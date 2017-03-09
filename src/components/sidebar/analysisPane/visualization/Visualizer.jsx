import './Visualizer.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import ActiveSlider from '../commonComponents/ActiveSlider.jsx';
import Select from 'react-select';
import 'rc-slider/assets/index.css';
const Slider = require('rc-slider');
const Range = Slider.Range;

import { isSubRange, validateRangeInputValue, fieldUnitAndRangeHandler } from '../analysisUtils.jsx';

//// IMPORTANT NOTES
// 1) This component is only currently capable of handling integers, thus all min/max values coming in are floored/ceiled accordingly

const classes = [
  {value: 2, label: '2'},
  {value: 3, label: '3'},
  {value: 4, label: '4'},
  {value: 5, label: '5'},
  {value: 6, label: '6'},
  {value: 7, label: '7'},
  {value: 8, label: '8'},
  {value: 9, label: '9'},
  {value: 10, label: '10'},
]
const palettes = [
  {value: 'red to green', label: 'Red to Green'},
  {value: 'green to red', label: 'Green to Red'},
  {value: 'increasing green', label: 'Increasing Green'},
  {value: 'decreasing green', label: 'Decreasing Green'},
  {value: 'increasing red', label: 'Increasing Red'},
  {value: 'decreasing red', label: 'Decreasing Red'},
  {value: 'increasing pink', label: 'Increasing Pink'},
  {value: 'decreasing pink', label: 'Decreasing Pink'},
  {value: 'increasing blue', label: 'Increasing Blue'},
  {value: 'decreasing blue', label: 'Decreasing Blue'}
]

class Visualizer extends React.Component {
  constructor(props){
    super();
    //// CREATE THE DEFAULT STATE
    // DETERMINE UNITS AND FORMATTERS
    // consider removing the propsMD from the props and only including it in the utils;
    
    //// LOAD STATE FROM MEMORY
    if (Object.keys(props.memory).length === 0){
      const defaultFieldVal = props.fields[0].value;
      var min, max, units, unitFormatter, unitUnformatter;
      ({min, max, units, unitFormatter, unitUnformatter} = fieldUnitAndRangeHandler(defaultFieldVal, props.propsMd));
      // SET THE DEFAULT STATE
      const defaultVisSetting = {
        titleValue: '',
        visActive: true,
        visValid: true,
        freezeVisValidity: false,
        fieldValue: props.fields[0],
        classNumValue: classes[2].value,
        paletteValue: palettes[0].value,
        range: [min, max],
        selectedRange: [min, max],
        units: units,
        unitFormatter: unitFormatter,
        unitUnformatter: unitUnformatter,
        rangeMinInputActive: false,
        rangeMaxInputActive: false,
        rangeInputValue: ''
      }
      this.state = defaultVisSetting;
    } else {
      this.state = props.memory;  
    }
    // TEMP
    this.state.tempRangeSelectorActive = false
    //// HANDLER BINDINGS ////
    // general bindings
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleVisActiveToggle = this.handleVisActiveToggle.bind(this);

    //class-based visualization bindings
    this.handleClassNumSelection = this.handleClassNumSelection.bind(this);
    this.handlePaletteSelection = this.handlePaletteSelection.bind(this);
    this.handleFieldSelection = this.handleFieldSelection.bind(this);
    
    //pass-fail visualization bindings
    // needs at least a second field selection binding, if not a third
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSliderAfterChange = this.handleSliderAfterChange.bind(this);
    this.handleRangeInputFocus = this.handleRangeInputFocus.bind(this);
    this.handleRangeInputBlur = this.handleRangeInputBlur.bind(this);
    this.handleRangeInputChange = this.handleRangeInputChange.bind(this);
    this.handleRangeInputKeydown = this.handleRangeInputKeydown.bind(this);
  }

  componentDidMount(){
    this.props.updateVisSettingMemory(this.props.id, this.state);
  }

  componentDidUpdate(){
    this.props.updateVisSettingMemory(this.props.id, this.state);
  }

  //// VISUALIZER TITLE INPUT HANDLERS

  handleTitleChange(e){
    const title = e.target.value
    this.setState({
      titleValue: title
    });
  }

  //// FIELD ACTIVE TOGGLER HANDLERS

  handleVisActiveToggle(ref){
    this.setState({
      visActive: !this.state.visActive
    });
  }

  //// FIELD SELECTION HANDLERS

  handleClassNumSelection(val){
    this.setState({
      classNumValue: val.value
    })
  }

  handlePaletteSelection(val){
    this.setState({
      paletteValue: val.value
    })
  }

  handleFieldSelection(val){
    var min, max, units, unitFormatter, unitUnformatter;
    ({min, max, units, unitFormatter, unitUnformatter} = fieldUnitAndRangeHandler(val.value, this.props.propsMd));
    this.setState({
      fieldValue: val,
      range: [min, max],
      selectedRange: [min, max],
      units: units,
      unitFormatter: unitFormatter,
      unitUnformatter: unitUnformatter,
      visValid: false,
      freezeVisValidity: false
    });
  }

  //// SLIDER HANDLERS
  // BUG :: handle slider change is being called on change of field but, after change is not
  // thus, freezeVisValidity is being left as true after field selections -- so far this is not affecting the process
  // but later on it might
  handleSliderChange(selectedRange){
    if (this.state.rangeMinInputActive){
      document.getElementsByClassName('rangeInput-min')[0].blur();
    } else  if (this.state.rangeMaxInputActive) {
      document.getElementsByClassName('rangeInput-max')[0].blur();
    }
    this.setState({
      selectedRange: selectedRange,
      freezeVisValidity: true
    });
  }

  handleSliderAfterChange(selectedRange){
    this.setState({
      selectedRange: selectedRange,
      visValid: isSubRange(this.state.range, selectedRange),
      freezeVisValidity: false
    });
  }

  //// RANGE INPUT HANDLERS

  handleRangeInputFocus(e){
    const className = e.target.className;
    if (className.indexOf('rangeInput-min') > -1){
      this.setState({
        rangeInputValue: this.state.selectedRange[0],
        rangeMinInputActive: true,
        freezeVisValidity: true
      });
    } else if (className.indexOf('rangeInput-max') > -1){
      this.setState({
        rangeInputValue: this.state.selectedRange[1],
        rangeMaxInputActive: true,
        freezeVisValidity: true
      });
    }
  }

  handleRangeInputBlur(e){
    const className = e.target.className;
    // MAKE A COPY
    var selectedRange = [...this.state.selectedRange];
    const rangeInputValue = this.state.unitUnformatter(this.state.rangeInputValue);
    if (className.indexOf('rangeInput-min') > -1){
      selectedRange[0] = validateRangeInputValue(rangeInputValue, 'minimum', this.state.range, selectedRange);
      this.setState({
        selectedRange: selectedRange,
        rangeMinInputActive: false,
        visValid: isSubRange(this.state.range, selectedRange),
        freezeVisValidity: false
      });
    } else if (className.indexOf('rangeInput-max') > -1){
      selectedRange[1] = validateRangeInputValue(rangeInputValue, 'maximum', this.state.range , selectedRange);
      this.setState({
        selectedRange: selectedRange,
        rangeMaxInputActive: false,
        visValid: isSubRange(this.state.range, selectedRange),
        freezeVisValidity: false
      });
    }
  }

  handleRangeInputKeydown(e){
    if (e.key === 'Enter'){
      e.target.blur();
    }
  }

  handleRangeInputChange(e){
    const newVal = this.state.unitUnformatter(e.target.value);
    this.setState({
      rangeInputValue: newVal
    });
  } 

  //// RENDERING

  render() {
    return (
      <div className="visualizer" ref={'visualizer-' + this.props.id} id={this.props.id}>
        <div className='titleAndControls visSection'>
          <input type='text' className='titleInput' value={this.state.titleValue} 
                 onChange={this.handleTitleChange} placeholder={'Visualizer Title ' + this.props.id} />
          <ActiveSlider active={this.state.visActive} handleActiveToggle={this.handleVisActiveToggle} />
        </div>
        <div className='fieldSelector visSection'>
          <span className='visSection-title'>Field:</span>
          <Select
            className='select-field select'
            name="Select Field"
            value={this.state.fieldValue}
            options={this.props.fields}
            onChange={this.handleFieldSelection}
            clearable={false}
          />
        </div>
        <div className='classSelector visSection'>
          <span className='visSection-title'>Classes:</span>
          <Select
            className='select-classNum select'
            name="Select Classes"
            value={this.state.classNumValue}
            options={classes}
            onChange={this.handleClassNumSelection}
            clearable={false}
          />
          <Select
            className='select-palette select'
            name="Select Palette"
            value={this.state.paletteValue}
            options={palettes}
            onChange={this.handlePaletteSelection}
            clearable={false}
          />
          <span className='visSection-title visSection-title-palette'>Palette:</span>
        </div>
        {this.state.tempRangeSelectorActive
          ? (<div className='rangeSelector visSection'>
              <span className='visSection-title'>Range:</span>
              <div className='sliderContainer'>
                <div className='rangeInputContainer'>
                  <div className='rangeInputSubCont-min rangeInputSubCont'>
                    <input className='rangeInput-min rangeInput' type="text" 
                          value={this.state.rangeMinInputActive
                                    ? this.state.rangeInputValue
                                    : this.state.unitFormatter(this.state.selectedRange[0])
                                  } 
                          onFocus={this.handleRangeInputFocus} 
                          onBlur={this.handleRangeInputBlur}
                          onChange={this.handleRangeInputChange}
                          onKeyDown={this.handleRangeInputKeydown} />
                    <span className='rangeInputLabel rangeInputLabel-min'>min</span>
                  </div>
                  <div className='rangeInputSubCont-max rangeInputSubCont'>
                    <span className='rangeInputLabel rangeInputLabel-max'>max</span>
                    <input className='rangeInput-max rangeInput' type="text" 
                          value={this.state.rangeMaxInputActive
                                    ? this.state.rangeInputValue
                                    : this.state.unitFormatter(this.state.selectedRange[1])
                                  } 
                          onFocus={this.handleRangeInputFocus} 
                          onBlur={this.handleRangeInputBlur}
                          onChange={this.handleRangeInputChange}
                          onKeyDown={this.handleRangeInputKeydown} />
                  </div>
                </div>
                <Range className='slider' value={this.state.selectedRange} 
                      min={this.state.range[0]} max={this.state.range[1]}
                      onChange={this.handleSliderChange} onAfterChange={this.handleSliderAfterChange} />
              </div>
            </div>)
          : null        
        }
        
        <div className={'validationBar validationBar-' + (this.state.visValid && this.state.visActive)} />
      </div>
    );
  }
}
 export default Visualizer;
