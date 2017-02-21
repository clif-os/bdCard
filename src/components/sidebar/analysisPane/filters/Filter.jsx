import './Filter.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import OnOffSlider from '../commonComponents/OnOffSlider.jsx';
import Select from 'react-select';

const memory = {
  titleValues: {

  },
  onOffValues: {

  },
  fieldValues: {

  },
  yearValues: {

  }
}

class Filter extends React.Component {
  constructor(props){
    super();
    this.state = {
      titleValue: memory.titleValues[props.id] !== undefined ? memory.titleValues[props.id] : '',
      onOffValue: memory.onOffValues[props.id] !== undefined ? memory.onOffValues[props.id] : true,
      fieldValue: memory.fieldValues[props.id] !== undefined ? memory.fieldValues[props.id] : props.fields[0].value,
      yearValue: memory.yearValues[props.id] !== undefined ? memory.yearValues[props.id] : props.years[0].value
    }
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleFilterOnOff = this.handleFilterOnOff.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.handleFieldSelection = this.handleFieldSelection.bind(this);
    this.handleYearSelection = this.handleYearSelection.bind(this);
  }

  handleTitleChange(e){
    memory.titleValues[this.props.id] = e.target.value;
    this.setState({
      titleValue: e.target.value 
    });
  }

  handleFilterOnOff(){
    memory.onOffValues[this.props.id] = !this.state.onOffValue;
    this.setState({
      onOffValue: !this.onOffValue
    });
  }

  handleRemoveFilter(){
    console.log('handling remove filter');
  }

  handleFieldSelection(val){
    memory.fieldValues[this.props.id] = val;
    this.setState({
      fieldValue: val
    });
  }

  handleYearSelection(val){
    memory.yearValues[this.props.id] = val;
    this.setState({
      yearValue: val
    });
  }

  render() {
    return (
      <div className="filter">
        <div className='titleAndControls filterSection'>
          <input type='text' className='titleInput' value={this.state.titleValue} onChange={this.handleTitleChange} placeholder={'Filter Title ' + this.props.id} />
          <div className='removeFilterButton'>
            <span className='fa fa-trash' onClick={this.handleRemoveFilter} />
          </div>
          <OnOffSlider active={this.state.onOffValue} handleFilterOnOff={this.handleFilterOnOff} />
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
          <Select
            className='select-year select'
            name="Select Year"
            value={this.state.yearValue}
            options={this.props.years}
            onChange={this.handleYearSelection}
            clearable={false}
          />
        </div>
        <div className='rangeSelector filterSection'>
          <span className='filterSection-title'>Range:</span>
        </div>
      </div>
    );
  }
}
 export default Filter;