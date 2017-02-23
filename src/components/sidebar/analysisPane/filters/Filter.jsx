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

class Filter extends React.Component {
  constructor(props){
    super();
    const defaultFilterSetting = {
      titleValue: '',
      filterActive: true,
      fieldValue: props.fields[0].value,
      filterValid: false
    }
    if (props.memory === undefined){
      this.state = defaultFilterSetting;  
    } else {
      this.state = props.memory;  
    }
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleFilterActiveToggle = this.handleFilterActiveToggle.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.handleFieldSelection = this.handleFieldSelection.bind(this);
  }

  componentDidMount(){
    this.props.updateFilterSettingsMemory(this.props.id, this.state);
  }

  componentDidUpdate(){
    console.log('NEW FILTER STATE: ');
    console.log(this.state);
    this.props.updateFilterSettingsMemory(this.props.id, this.state);
  }

  handleTitleChange(e){
    const title = e.target.value
    this.setState({
      titleValue: title,
      filterValid: validateTitle(title)
    });
  }

  handleFilterActiveToggle(ref){
    this.setState({
      filterActive: !this.state.filterActive
    });
  }

  handleFieldSelection(val){
    this.setState({
      fieldValue: val
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
          <input type='text' className='titleInput' value={this.state.titleValue} onChange={this.handleTitleChange} placeholder={'Filter Title ' + this.props.id} />
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
            <Range className='slider' />
          </div>
        </div>
        <div className={'validationBar validationBar-' + (this.state.filterValid && this.state.filterActive)} />
      </div>
    );
  }
}
 export default Filter;