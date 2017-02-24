import './Filter.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import ActiveSlider from '../commonComponents/ActiveSlider.jsx';
import Select from 'react-select';
import 'rc-slider/assets/index.css';
const Slider = require('rc-slider');
const Range = Slider.Range;

import { isSubRange, validateRangeInputValue } from './filterValidators.jsx';
import { dollarFormatter, stripDollarFormat } from '../../../../utils/generalUtils.jsx';

class Filter extends React.Component {
  constructor(props){
    super();
    // const defaultRange = [
    //       props.propsMd[props.fields[0].value].range.min,
    //       props.propsMd[props.fields[0].value].range.max
    //   ]
    const defaultFilterSetting = {
      titleValue: '',
      filterActive: true,
      fieldValue: props.fields[0].value,
      filterValid: false,
      range: [
          props.propsMd[props.fields[0].value].range.min,
          props.propsMd[props.fields[0].value].range.max
      ],
      selectedRange: [
          props.propsMd[props.fields[0].value].range.min,
          props.propsMd[props.fields[0].value].range.max
      ],
      units: props.propsMd[props.fields[0].value].units
    }
    if (props.memory === undefined){
      this.state = defaultFilterSetting;
      // potentially going to be using this to allow an editing session of the value
      this.state.rangeMinInputActive = false;
      this.state.rangeMaxInputActive = false;
      // range input value state used to set the value of the input during an editing session
      // -- before and after editing, the value of the input is determined by the sliders
      this.state.rangeInputValue = '';
    } else {
      this.state = props.memory;  
    }
    
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
    this.setState({
      fieldValue: val
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
    const rangeInputValue = stripDollarFormat(this.state.rangeInputValue);
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
    const newVal = stripDollarFormat(e.target.value);
    this.setState({
      rangeInputValue: newVal
    });
  } 

  //// RENDERING

  render() {
    console.log('SELECTED RANGE:', this.state.selectedRange);
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
                                : dollarFormatter(this.state.selectedRange[0])
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
                                : dollarFormatter(this.state.selectedRange[1])
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
