import './ClassesVisualizer.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import ActiveSlider from '../commonComponents/ActiveSlider.jsx';
import Select from 'react-select';

import 'rc-slider/assets/index.css';
const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

import { fieldUnitAndRangeHandler } from '../analysisUtils.jsx';
import { choseFormatter } from '../../../../utils/unitFormatters.jsx';

import { splitRangeByClasses } from '../../../../filter/filterUtils.jsx';
import { generatePaintArray } from '../../../../mapbox/geojsonLayerUtils.jsx';

//// IMPORTANT NOTES
// 1) This component is only currently capable of handling integers, thus all min/max values coming in are floored/ceiled accordingly

const splitsToSliderValues = splits => {
  return splits.reduce((acc, split) => {
    split.forEach(value => {
      if (acc.length === 0 || acc.indexOf(value) === -1){
        acc.push(value);
      }
    });
    return acc;
  }, []);
}

const sliderValuesToSplits = sliderVals => {
  return sliderVals.reduce((acc, val) => {
    
    return acc;
  }, [])
}

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

class ClassesVisualizer extends React.Component {
  constructor(props){
    super();
    //// CREATE THE DEFAULT STATE
    // DETERMINE UNITS AND FORMATTERS
    // consider removing the propsMD from the props and only including it in the utils;
    // SET LOOKUPS
    this.propRegistry = props.dropdownData.dropdownPropRegistry;
    this.yearLookups = Object.assign({}, props.dropdownData.yearLookups);
    //// LOAD STATE FROM MEMORY
    if (Object.keys(props.memory).length === 0){
      const fieldOptions = props.dropdownData.fieldDropdowns;
      
      
      const defaultFieldVal = fieldOptions[0].value;
      const defaultFieldLabel = fieldOptions[0].label;
      const defaultYearOptions = this.yearLookups[defaultFieldVal];
      const defaultYearVal = defaultYearOptions[0].value;
      const defaultYearLabel = defaultYearOptions[0].label;

      const defaultSelectedProp = this.propRegistry[defaultFieldVal + defaultYearVal];

      var {min, max, median, units } = fieldUnitAndRangeHandler(defaultSelectedProp, props.propsMd);
      const { unitFormatter } = choseFormatter(units);
      var medianLabel = 'median: ' + unitFormatter(median);
      var medianMark = {};
      medianMark[median] = medianLabel;
      
      const splits = splitRangeByClasses([min, max], classes[2].value);
      const splitVals = splitsToSliderValues(splits);

      // SET THE DEFAULT STATE
      const defaultVisSetting = {
        visActive: true,
        visValid: true,

        selectedProp: defaultSelectedProp,

        fieldValue: defaultFieldVal,
        fieldLabel: defaultFieldLabel,
        fieldOptions: fieldOptions,
        yearValue: defaultYearVal,
        yearLabel: defaultYearLabel,
        yearOptions: defaultYearOptions,

        classNumValue: classes[2].value,
        paletteValue: palettes[0].value,
        
        freezeValidity: false,
        range: [min, max],
        selectedRange: splitVals,
        selectedSplitRanges: splits,
        medianMark: medianMark,
        units: units
      }
      this.state = defaultVisSetting;
    } else {
      this.state = props.memory;  
    }
    //// HANDLER BINDINGS ////
    // general bindings
    this.handleVisActiveToggle = this.handleVisActiveToggle.bind(this);

    // class-based visualization bindings
    this.handleClassNumSelection = this.handleClassNumSelection.bind(this);
    this.handlePaletteSelection = this.handlePaletteSelection.bind(this);
    this.handleFieldSelection = this.handleFieldSelection.bind(this);
    this.handleYearSelection = this.handleYearSelection.bind(this);
    // slider
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSliderAfterChange = this.handleSliderAfterChange.bind(this);
    this.sliderTipFormatter = this.sliderTipFormatter.bind(this);
  }

  componentDidMount(){
    var style = document.getElementById(this.props.id).style;
    style.right = '0px';
    this.props.updateVisSettingMemory(this.props.id, this.state);
    this.updateSliderStyles();
  }

  componentDidUpdate(){
    this.props.updateVisSettingMemory(this.props.id, this.state);
    this.updateSliderStyles();
  }

  //// FIELD ACTIVE TOGGLER HANDLERS

  handleVisActiveToggle(ref){
    this.setState({
      visActive: !this.state.visActive
    });
  }

  //// FIELD SELECTION HANDLERS

  handleClassNumSelection(val){
    const splits = splitRangeByClasses(this.state.range, val.value);
    const splitVals = splitsToSliderValues(splits);
    this.setState({
      classNumValue: val.value,
      selectedRange: splitVals,
      selectedSplitRanges: splits,
    });
  }

  handlePaletteSelection(val){
    this.setState({
      paletteValue: val.value
    });
  }

  handleFieldSelection(val){
    const fieldVal = val.value;
    const fieldLabel = val.label;
    const defaultYearOptions = this.yearLookups[fieldVal];
    const defaultYearVal = defaultYearOptions[0].value;
    const defaultYearLabel = defaultYearOptions[0].label;
    const defaultSelectedProp = this.propRegistry[fieldVal + defaultYearVal];
    
    var {min, max, median, units } = fieldUnitAndRangeHandler(defaultSelectedProp, this.props.propsMd);
    const { unitFormatter } = choseFormatter(units);
    var medianLabel = 'median: ' + unitFormatter(median);
    var medianMark = {};
    medianMark[median] = medianLabel;
      
    const splits = splitRangeByClasses([min, max], this.state.classNumValue);
    const splitVals = splitsToSliderValues(splits);

    this.setState({
      selectedProp: defaultSelectedProp,
      fieldValue: fieldVal,
      fieldLabel: fieldLabel,
      yearValue: defaultYearVal,
      yearLabel: defaultYearLabel,
      yearOptions: defaultYearOptions,
      
      filterValid: false,
      freezeValidity: false,

      range: [min, max],
      selectedRange: splitVals,
      selectedSplitRanges: splits,
      medianMark: medianMark,
      units: units
    });
  }

  handleYearSelection(val){
    const yearVal = val.value;
    const yearLabel = val.label;
    const selectedProp = this.propRegistry[this.state.fieldValue + yearVal];

    var {min, max, median, units } = fieldUnitAndRangeHandler(selectedProp, this.props.propsMd);
    const { unitFormatter } = choseFormatter(units);
    var medianLabel = 'median: ' + unitFormatter(median);
    var medianMark = {};
    medianMark[median] = medianLabel;
      
    const splits = splitRangeByClasses([min, max], this.state.classNumValue);
    const splitVals = splitsToSliderValues(splits);

    this.setState({
      selectedProp: selectedProp,
      yearValue: yearVal,
      yearLabel: yearLabel,
      
      filterValid: false,
      freezeValidity: false,

      range: [min, max],
      selectedRange: splitVals,
      selectedSplitRanges: splits,
      medianMark: medianMark,
      units: units
    });
  }

  //// SLIDER HANDLERS
  // BUG :: handle slider change is being called on change of field but, after change is not
  // thus, freezeValidity is being left as true after field selections -- so far this is not affecting the process
  // but later on it might
  handleSliderChange(selectedRange){
    // keep upper and lower limits locked
    selectedRange[0] = this.state.range[0];
    selectedRange[selectedRange.length - 1] = this.state.range[1];
    this.setState({
      selectedRange: selectedRange,
      freezeValidity: true
    });
  }

  handleSliderAfterChange(selectedRange){
    this.setState({
      selectedRange: selectedRange,
      freezeValidity: false
    });
  }

  sliderTipFormatter(val){
    const { unitFormatter } = choseFormatter(this.state.units);
    return `${unitFormatter(val)}`;
  }

  updateSliderStyles(){
    //// FORMAT HANDLES ////
    // reset all to visible
    for (var i = 0; i < this.state.selectedRange.length; i++){
      const order = i + 1;
      const handle = document.getElementsByClassName('rc-slider-handle-' + order)[0];
      handle.style.visibility = 'visible';
    }
    // set ends to hidden
    const lastHandle = document.getElementsByClassName('rc-slider-handle-' + this.state.selectedRange.length)[0];
    lastHandle.style.visibility = 'hidden';
    const firstHandle = document.getElementsByClassName('rc-slider-handle-1')[0];
    firstHandle.style.visibility = 'hidden';
    //// FORMAT TRACKS ////
    var paintArray = generatePaintArray(this.state.classNumValue, this.state.paletteValue);
    // the last value of the paint array will cover null values and is not relevant to the slider process
    paintArray.pop();
    paintArray.forEach((paint, i) => {
      const order = i + 1;
      const color = paint.fillPaint['fill-color'];
      const track = document.getElementsByClassName('rc-slider-track-' + order)[0];
      track.style.backgroundColor = color;
    });
  }

  //// RENDERING

  render() {
    return (
      <div className="classesVisualizer" ref={'visualizer-' + this.props.id} id={this.props.id}>
        <div className='titleAndControls-visualizer visSection'>
          <ActiveSlider active={this.state.visActive} handleActiveToggle={this.handleVisActiveToggle} />
        </div>
        <div className='fieldSelector visSection'>
          <span className='visSection-title'>Field:</span>
          <Select
            className='select-field select'
            name="Select Field"
            value={this.state.fieldValue}
            options={this.state.fieldOptions}
            onChange={this.handleFieldSelection}
            clearable={false}
          />
        </div>
        <div className='yearSelector visSection'>
          <span className='visSection-title'>Year:</span>
          <Select
            className='select-year select'
            name="Select Year"
            value={this.state.yearValue}
            options={this.state.yearOptions}
            onChange={this.handleYearSelection}
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
        <div className='rangeSelector visSection'>
          <span className='visSection-title'>Range:</span>
          <div className='sliderContainer'>
            <Range className='slider' value={this.state.selectedRange} 
                   min={this.state.range[0]} max={this.state.range[1]}
                   marks={this.state.medianMark}
                   onChange={this.handleSliderChange} onAfterChange={this.handleSliderAfterChange} 
                   tipFormatter={this.sliderTipFormatter} />
          </div>
        </div>
        <div className={'validationBar validationBar-' + (this.state.visValid && this.state.visActive)} />
      </div>
    );
  }
}
 export default ClassesVisualizer;
