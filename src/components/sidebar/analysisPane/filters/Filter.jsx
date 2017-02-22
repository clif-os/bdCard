import './Filter.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import ActiveSlider from '../commonComponents/ActiveSlider.jsx';
import Select from 'react-select';
const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
import 'rc-slider/assets/index.css';

import { validateTitle } from './filterValidators.jsx'

// COMPONENT MEMORY
const memory = {}

class Filter extends React.Component {
  constructor(props){
    super();
    console.log('incoming props to the filter component ', props.id);
    console.log()
    if (memory[props.id] !== undefined){
      console.log('incoming filter id exists in memory state as: ', memory[props.id]);
      this.state = memory[props.id]
    } else {
      console.log('incoming filter id does not exist in memory, setting to default memory state');
      var defaultMemory = {
        titleValue: '',
        filterActive: true,
        fieldValue: props.fields[0].value,
        yearValue: props.years[0].value,
        filterValid: false
      }
      // SET THE MEMORY
      memory[props.id] = defaultMemory;
      // SET THE COMPONENT STATE
      this.state = defaultMemory;
    }
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleFilterActiveToggle = this.handleFilterActiveToggle.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.handleFieldSelection = this.handleFieldSelection.bind(this);
    this.handleYearSelection = this.handleYearSelection.bind(this);
  }

  componentDidMount(){
    console.log('componentDidMount');
    this.props.updateFilterSettingsMemory(this.props.id, this.state);
  }

  componentDidUpdate(){
    console.log('updating filter memory');
    this.props.updateFilterSettingsMemory(this.props.id, this.state);
  }

  handleTitleChange(e){
    const title = e.target.value
    memory[this.props.id].titleValue = title;
    this.setState({
      titleValue: title,
      filterValid: validateTitle(title)
    });
  }

  handleFilterActiveToggle(ref){
    memory[this.props.id].filterActive = !memory[this.props.id].filterActive
    this.setState({
      filterActive: memory[this.props.id].filterActive
    });
  }

  handleFieldSelection(val){
    memory[this.props.id].fieldValue = val
    this.setState({
      fieldValue: val
    });
  }

  handleYearSelection(val){
    memory[this.props.id].yearValue = val
    this.setState({
      yearValue: val
    });
  }

  handleRemoveFilter(e){
    // SCRAPE FILTER ID FROM REMOVE FILTER BUTTON ID
    const filterId = e.target.id.slice(e.target.id.indexOf('-') + 1);
    console.log(filterId);
    this.props.handleRemoveFilter(filterId);
  }

  render() {
    return (
      <div className="filter" ref={'filter-' + this.props.id} id={this.props.id}>
        <div className='titleAndControls filterSection'>
          <input type='text' className='titleInput' value={memory[this.props.id].titleValue} onChange={this.handleTitleChange} placeholder={'Filter Title ' + this.props.id} />
          <div className='removeFilterButton'>
            <span className='fa fa-trash' id={'rfb-' + this.props.id} onClick={this.handleRemoveFilter} />
          </div>
          <ActiveSlider active={memory[this.props.id].filterActive} handleFilterActiveToggle={this.handleFilterActiveToggle} />
        </div>
        <div className='fieldSelector filterSection'>
          <span className='filterSection-title'>Field:</span>
          <Select
            className='select-field select'
            name="Select Field"
            value={memory[this.props.id].fieldValue}
            options={this.props.fields}
            onChange={this.handleFieldSelection}
            clearable={false}
          />
          <Select
            className='select-year select'
            name="Select Year"
            value={memory[this.props.id].yearValue}
            options={this.props.years}
            onChange={this.handleYearSelection}
            clearable={false}
          />
        </div>
        <div className='rangeSelector filterSection'>
          <span className='filterSection-title'>Range:</span>
          <div className='sliderContainer'>
            <Range className='slider' />
          </div>
        </div>
        <div className={'validationBar validationBar-' + (this.state.filterValid && this.state.filterActive)} />
      </div>
    );
  }
}
 export default Filter;