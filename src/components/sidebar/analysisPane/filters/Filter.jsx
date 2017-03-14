import './Filter.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import ActiveSlider from '../commonComponents/ActiveSlider.jsx';
import Select from 'react-select';
import 'rc-slider/assets/index.css';
const Slider = require('rc-slider');
const Range = Slider.Range;

import { isSubRange, validateAndNormalizeRangeInputValue, fieldUnitAndRangeHandler } from '../analysisUtils.jsx';

//// IMPORTANT NOTES
// 1) This component is only currently capable of handling integers, thus all min/max values coming in are floored/ceiled accordingly

class Filter extends React.Component {
  constructor(props){
    super();
    //// CREATE THE DEFAULT STATE
    // DETERMINE UNITS AND FORMATTERS
    // consider removing the propsMD from the props and only including it in the utils;
    
    //// LOAD STATE FROM MEMORY
    if (props.memory === undefined){
      const fieldOptions = props.dropdownData.fieldDropdowns;
      const yearLookups = props.dropdownData.yearLookups;
      const propRegistry = props.dropdownData.dropdownPropRegistry;
      const defaultFieldVal = fieldOptions[0].value;
      const defaultFieldLabel = fieldOptions[0].label;
      const defaultYearOptions = yearLookups[defaultFieldVal];
      const defaultYearVal = defaultYearOptions[0].value;
      const defaultYearLabel = defaultYearOptions[0].label;
      
      const defaultSelectedProp = propRegistry[defaultFieldVal + defaultYearVal];

      var min, max, units, unitFormatter, unitUnformatter;
      ({min, max, units, unitFormatter, unitUnformatter} = fieldUnitAndRangeHandler(defaultSelectedProp, props.propsMd));
      // SET THE DEFAULT STATE
      const defaultFilterSetting = {
        yearLookups: yearLookups,
        propRegistry: propRegistry,

        titleValue: '',
        filterActive: true,

        selectedProp: defaultSelectedProp,

        fieldValue: defaultFieldVal,
        fieldLabel: defaultFieldLabel,
        fieldOptions: fieldOptions,
        yearValue: defaultYearVal,
        yearLabel: defaultYearLabel,
        yearOptions: defaultYearOptions,

        filterValid: false,
        freezeFilterValidity: false,
        range: [min, max],
        selectedRange: [min, max],
        units: units,
        unitFormatter: unitFormatter,
        unitUnformatter: unitUnformatter,
        rangeMinInputActive: false,
        rangeMaxInputActive: false,
        rangeInputValue: ''
      }
      this.state = defaultFilterSetting;
    } else {
      this.state = props.memory;  
    }
    //// HANDLER BINDINGS
    this.handleFilterActiveToggle = this.handleFilterActiveToggle.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.handleFieldSelection = this.handleFieldSelection.bind(this);
    this.handleYearSelection = this.handleYearSelection.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSliderAfterChange = this.handleSliderAfterChange.bind(this);
    this.handleRangeInputFocus = this.handleRangeInputFocus.bind(this);
    this.handleRangeInputBlur = this.handleRangeInputBlur.bind(this);
    this.handleRangeInputChange = this.handleRangeInputChange.bind(this);
    this.handleRangeInputKeydown = this.handleRangeInputKeydown.bind(this);

    // document.addEventListener('REDRAW_COMPLETE');
  }

  componentDidMount(){
    var style = document.getElementById(this.props.id).style;
    style.right = '0px';
    this.props.updateFilterSettingsMemory(this.props.id, this.state);
  }

  componentDidUpdate(){
    this.props.updateFilterSettingsMemory(this.props.id, this.state);
  }

  //// REMOVE FILTER HANDLER

  handleRemoveFilter(e){
    // scrape filter ID from the remove filter button id
    // this is probably not necessary anymore, was doing this during troubleshooting of a different issue
    var style = document.getElementById(this.props.id).style;
    style.visibility = 'hidden';
    const filterId = e.target.id.slice(e.target.id.indexOf('-') + 1);
    this.props.handleRemoveFilter(filterId);
  }

  //// FIELD ACTIVE TOGGLER HANDLERS

  handleFilterActiveToggle(ref){
    this.setState({
      filterActive: !this.state.filterActive
    });
  }

  //// FIELD SELECTION HANDLERS

  handleFieldSelection(val){
    const fieldVal = val.value;
    const fieldLabel = val.label;

    const defaultYearOptions = this.state.yearLookups[fieldVal];
    const defaultYearVal = defaultYearOptions[0].value;
    const defaultYearLabel = defaultYearOptions[0].label;
    const defaultSelectedProp = this.state.propRegistry[fieldVal + defaultYearVal];
    const {min, max, units, unitFormatter, unitUnformatter} = fieldUnitAndRangeHandler(defaultSelectedProp, this.props.propsMd);

    this.setState({
      selectedProp: defaultSelectedProp,
      fieldValue: fieldVal,
      fieldLabel: fieldLabel,
      yearValue: defaultYearVal,
      yearLabel: defaultYearLabel,
      yearOptions: defaultYearOptions,

      range: [min, max],
      selectedRange: [min, max],
      units: units,
      unitFormatter: unitFormatter,
      unitUnformatter: unitUnformatter,
      filterValid: false,
      freezeFilterValidity: false
    });
  }

  handleYearSelection(val){
    const yearVal = val.value;
    const yearLabel = val.label;
    const selectedProp = this.state.propRegistry[this.state.fieldValue + yearVal];
    const {min, max, units, unitFormatter, unitUnformatter} = fieldUnitAndRangeHandler(selectedProp, this.props.propsMd);

    this.setState({
      selectedProp: selectedProp,
      yearValue: yearVal,
      yearLabel: yearLabel,

      range: [min, max],
      selectedRange: [min, max],
      units: units,
      unitFormatter: unitFormatter,
      unitUnformatter: unitUnformatter,
      filterValid: false,
      freezeFilterValidity: false
    });
  }

  //// SLIDER HANDLERS
  // BUG :: handle slider change is being called on change of field but, after change is not
  // thus, freezeFilterValidity is being left as true after field selections -- so far this is not affecting the process
  // but later on it might
  handleSliderChange(selectedRange){
    if (this.state.rangeMinInputActive){
      document.getElementsByClassName('rangeInput-min')[0].blur();
    } else  if (this.state.rangeMaxInputActive) {
      document.getElementsByClassName('rangeInput-max')[0].blur();
    }
    this.setState({
      selectedRange: selectedRange,
      freezeFilterValidity: true
    });
  }

  handleSliderAfterChange(selectedRange){
    this.setState({
      selectedRange: selectedRange,
      filterValid: isSubRange(this.state.range, selectedRange),
      freezeFilterValidity: false
    });
  }

  //// RANGE INPUT HANDLERS

  handleRangeInputFocus(e){
    const className = e.target.className;
    if (className.indexOf('rangeInput-min') > -1){
      this.setState({
        rangeInputValue: this.state.selectedRange[0],
        rangeMinInputActive: true,
        freezeFilterValidity: true
      });
    } else if (className.indexOf('rangeInput-max') > -1){
      this.setState({
        rangeInputValue: this.state.selectedRange[1],
        rangeMaxInputActive: true,
        freezeFilterValidity: true
      });
    }
  }

  handleRangeInputBlur(e){
    const className = e.target.className;
    // MAKE A COPY
    var selectedRange = [...this.state.selectedRange];
    console.log(this.state.rangeInputValue);
    const rangeInputValue = this.state.unitUnformatter(this.state.rangeInputValue);
    console.log(rangeInputValue);
    if (className.indexOf('rangeInput-min') > -1){
      selectedRange[0] = validateAndNormalizeRangeInputValue(rangeInputValue, 'minimum', this.state.range, selectedRange);
      console.log(selectedRange[0])
      this.setState({
        selectedRange: selectedRange,
        rangeMinInputActive: false,
        filterValid: isSubRange(this.state.range, selectedRange),
        freezeFilterValidity: false
      });
    } else if (className.indexOf('rangeInput-max') > -1){
      selectedRange[1] = validateAndNormalizeRangeInputValue(rangeInputValue, 'maximum', this.state.range , selectedRange);
      this.setState({
        selectedRange: selectedRange,
        rangeMaxInputActive: false,
        filterValid: isSubRange(this.state.range, selectedRange),
        freezeFilterValidity: false
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
          <ActiveSlider active={this.state.filterActive} handleActiveToggle={this.handleFilterActiveToggle} />
          <div className='removeFilterButton'>
            <span className='fa fa-trash' id={'rfb-' + this.props.id} onClick={this.handleRemoveFilter} />
          </div>
        </div>
        <div className='fieldSelector filterSection'>
          <span className='filterSection-title'>Field:</span>
          <Select
            className='select-field select'
            name="Select Field"
            value={this.state.fieldValue}
            options={this.state.fieldOptions}
            onChange={this.handleFieldSelection}
            clearable={false}
          />
        </div>
        <div className='yearSelector filterSection'>
          <span className='filterSection-title'>Year:</span>
          <Select
            className='select-year select'
            name="Select Year"
            value={this.state.yearValue}
            options={this.state.yearOptions}
            onChange={this.handleYearSelection}
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
