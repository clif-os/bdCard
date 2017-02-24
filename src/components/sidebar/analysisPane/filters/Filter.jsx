import './Filter.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import ActiveSlider from '../commonComponents/ActiveSlider.jsx';
import Select from 'react-select';
import 'rc-slider/assets/index.css';
const Slider = require('rc-slider');
const Range = Slider.Range;

import { isSubRange, validateRangeInputValue } from './filterValidators.jsx';
import { dollarFormatter, dollarUnformatter, 
         percentFormatter, percentUnformatter, returnVal } from '../../../../utils/generalUtils.jsx';

//// IMPORTANT NOTES
// 1) This component is only currently capable of handling integers, thus all min/max values coming in are floored/ceiled accordingly

//// TODO:
// The percent values are formatted inconsistently in the data

class Filter extends React.Component {
  constructor(props){
    super();
    //// CREATE THE DEFAULT STATE
    // DETERMINE UNITS AND FORMATTERS
    // REFACTOR EVENTUALLY TO ITS OWN UTIL... should just take in the lookupMD and a field value and return min/max/ 2 formatters
    const defaultFieldVal = props.fields[0].value
    const units = props.propsMd[defaultFieldVal].units;
    console.log(units);
    let min = props.propsMd[defaultFieldVal].range.min;
    let max = props.propsMd[defaultFieldVal].range.max;
    let unitFormatter, unitUnformatter;
    if (units === 'usd'){
      min = Math.floor(min);
      max = Math.ceil(max);
      unitFormatter = dollarFormatter;
      unitUnformatter = dollarUnformatter;
    } else if (units === 'decile' || units === 'number'){
      min = Math.floor(min);
      max = Math.ceil(max);
      unitFormatter = returnVal;
      unitUnformatter = returnVal;
    } else if (units === 'percent'){
      // the percent data is formatted inconsistently (sometimes as a share of 1, others as a regular percent of 100)
      // later on the data should be tranformed to have  a consistent percent format\
      if (min < 1 && max <= 1){
        min = min * 100;
        max = max * 100;
      }
      unitFormatter = percentFormatter;
      unitUnformatter = percentUnformatter;
    }
    // SET THE DEFAULT STATE
    const defaultFilterSetting = {
      titleValue: '',
      filterActive: true,
      fieldValue: defaultFieldVal,
      filterValid: false,
      range: [min, max],
      selectedRange: [min, max],
      units: units,
      unitFormatter: unitFormatter,
      unitUnformatter: unitUnformatter
    }
    //// LOAD STATE FROM MEMORY
    if (props.memory === undefined){
      this.state = defaultFilterSetting;
      this.state.rangeMinInputActive = false;
      this.state.rangeMaxInputActive = false;
      // range input value state used to set the value of the input during an editing session
      // -- before and after editing, the value of the input is determined by the sliders
      this.state.rangeInputValue = '';
    } else {
      this.state = props.memory;  
    }
    //// HANDLER BINDINGS
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleFilterActiveToggle = this.handleFilterActiveToggle.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.handleFieldSelection = this.handleFieldSelection.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSliderAfterChange = this.handleSliderAfterChange.bind(this);
    this.handleRangeInputFocus = this.handleRangeInputFocus.bind(this);
    this.handleRangeInputBlur = this.handleRangeInputBlur.bind(this);
    this.handleRangeInputChange = this.handleRangeInputChange.bind(this);
    this.handleRangeInputKeydown = this.handleRangeInputKeydown.bind(this);
  }

  componentDidMount(){
    this.props.updateFilterSettingsMemory(this.props.id, this.state);
  }

  componentDidUpdate(){
    // console.log('NEW FILTER STATE: ');
    // console.log(this.state);
    this.props.updateFilterSettingsMemory(this.props.id, this.state);
  }

  //// REMOVE FILTER HANDLER

  handleRemoveFilter(e){
    // scrape filter ID from the remove filter button id
    // this is probably not necessary anymore, was doing this during troubleshooting of a different issue
    const filterId = e.target.id.slice(e.target.id.indexOf('-') + 1);
    this.props.handleRemoveFilter(filterId);
  }

  //// FILTER TITLE INPUT HANDLERS

  handleTitleChange(e){
    const title = e.target.value
    this.setState({
      titleValue: title
    });
  }

  //// FIELD ACTIVE TOGGLER HANDLERS

  handleFilterActiveToggle(ref){
    this.setState({
      filterActive: !this.state.filterActive
    });
  }

  //// FIELD SELECTION HANDLERS

  handleFieldSelection(val){
    const units = this.props.propsMd[val.value].units;
    console.log(units);
    let min = this.props.propsMd[val.value].range.min;
    let max = this.props.propsMd[val.value].range.max;
    let unitFormatter, unitUnformatter;
    if (units === 'usd'){
      min = Math.floor(min);
      max = Math.ceil(max);
      unitFormatter = dollarFormatter;
      unitUnformatter = dollarUnformatter;
    } else if (units === 'decile' || units === 'number'){
      min = Math.floor(min);
      max = Math.ceil(max);
      unitFormatter = returnVal;
      unitUnformatter = returnVal;
    } else if (units === 'percent'){
      // the percent data is formatted inconsistently (sometimes as a share of 1, others as a regular percent of 100)
      // later on the data should be tranformed to have  a consistent percent format\
      if (min < 1 && max <= 1){
        console.log('handling as a percent of 1');
        min = Math.floor(min * 100);
        max = Math.ceil(max * 100);
      } else {
        console.log('handling as a percent of 100');
        min = Math.floor(min);
        max = Math.ceil(max);
      }
      unitFormatter = percentFormatter;
      unitUnformatter = percentUnformatter;
    }
    this.setState({
      fieldValue: val,
      range: [min, max],
      selectedRange: [min, max],
      units: units,
      unitFormatter: unitFormatter,
      unitUnformatter: unitUnformatter,
      filterValid: false
    });
  }

  //// SLIDER HANDLERS

  handleSliderChange(selectedRange){
    if (this.state.rangeMinInputActive){
      document.getElementsByClassName('rangeInput-min')[0].blur();
    } else  if (this.state.rangeMaxInputActive) {
      document.getElementsByClassName('rangeInput-max')[0].blur();
    }
    this.setState({
      selectedRange: selectedRange
    });
  }

  handleSliderAfterChange(selectedRange){
    this.setState({
      selectedRange: selectedRange,
      filterValid: isSubRange(this.state.range, selectedRange)
    });
  }

  //// RANGE INPUT HANDLERS

  handleRangeInputFocus(e){
    const className = e.target.className;
    if (className.indexOf('rangeInput-min') > -1){
      this.setState({
        rangeInputValue: this.state.selectedRange[0],
        rangeMinInputActive: true
      });
    } else if (className.indexOf('rangeInput-max') > -1){
      this.setState({
        rangeInputValue: this.state.selectedRange[1],
        rangeMaxInputActive: true
      });
    }
  }

  handleRangeInputBlur(e){
    const className = e.target.className;
    var selectedRange = this.state.selectedRange;
    const rangeInputValue = this.state.unitUnformatter(this.state.rangeInputValue);
    if (className.indexOf('rangeInput-min') > -1){
      selectedRange[0] = validateRangeInputValue(rangeInputValue, 'minimum', this.state.range, selectedRange);
      this.setState({
        selectedRange: selectedRange,
        rangeMinInputActive: false,
        filterValid: isSubRange(this.state.range, selectedRange)
      });
    } else if (className.indexOf('rangeInput-max') > -1){
      selectedRange[1] = validateRangeInputValue(rangeInputValue, 'maximum', this.state.range , selectedRange);
      this.setState({
        selectedRange: selectedRange,
        rangeMaxInputActive: false,
        filterValid: isSubRange(this.state.range, selectedRange)
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
      <div className="filter" ref={'filter-' + this.props.id} id={this.props.id}>
        <div className='titleAndControls filterSection'>
          <input type='text' className='titleInput' value={this.state.titleValue} 
                 onChange={this.handleTitleChange} placeholder={'Filter Title ' + this.props.id} />
          <div className='removeFilterButton'>
            <span className='fa fa-trash' id={'rfb-' + this.props.id} onClick={this.handleRemoveFilter} />
          </div>
          <ActiveSlider active={this.state.filterActive} handleFilterActiveToggle={this.handleFilterActiveToggle} />
        </div>
        <div className='fieldSelector filterSection'>
          <span className='filterSection-title'>Field:</span>
          <Select
            className='select-field select'
            name="Select Field"
            value={this.state.fieldValue}
            options={this.props.fields}
            onChange={this.handleFieldSelection}
            clearable={false}
          />
        </div>
        <div className='rangeSelector filterSection'>
          <span className='filterSection-title'>Range:</span>
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
        </div>
        <div className={'validationBar validationBar-' + (this.state.filterValid && this.state.filterActive)} />
      </div>
    );
  }
}
 export default Filter;
