import './Filter.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import OnOffSlider from '../commonComponents/OnOffSlider.jsx';

const memory = {
  titleValues: {

  },
  onOffValues: {

  }
}

class Filter extends React.Component {
  constructor(props){
    super();
    this.state = {
      titleValue: memory.titleValues[props.id] !== undefined ? memory.titleValues[props.id] : '',
      onOffValue: memory.onOffValues[props.id] !== undefined ? memory.onOffValues[props.id] : true
    }
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleFilterOnOff = this.handleFilterOnOff.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
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
          <select className='select-field'>
            {this.renderSelectFieldOptions(this.props.fields)}
          </select>
          <select className='select-year'>
            {this.renderSelectYearOptions(this.props.years)}
          </select>
        </div>
        <div className='rangeSelector filterSection'>
          <span className='filterSection-title'>Range:</span>
        </div>
      </div>
    );
  }
  renderSelectFieldOptions(fields){
    const selectFieldNodes = fields.map((field, i) => {
      return (
        <option value={field} key={i}>{field}</option>
      )
    });
    return selectFieldNodes;
  }
  renderSelectYearOptions(years){
    const selectYearNodes = years.map((year, i) => {
      return (
        <option value={year} key={i}>{year}</option>
      )
    });
    return selectYearNodes
  }
}
 export default Filter;