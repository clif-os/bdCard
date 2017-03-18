import './ClassesVisualizer.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import ActiveSlider from '../commonComponents/ActiveSlider.jsx';
import Select from 'react-select';

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
      
      // SET THE DEFAULT STATE
      const defaultVisSetting = {
        visActive: true,
        visValid: true,
        freezeVisValidity: false,

        selectedProp: defaultSelectedProp,

        fieldValue: defaultFieldVal,
        fieldLabel: defaultFieldLabel,
        fieldOptions: fieldOptions,
        yearValue: defaultYearVal,
        yearLabel: defaultYearLabel,
        yearOptions: defaultYearOptions,

        classNumValue: classes[2].value,
        paletteValue: palettes[0].value
      }
      this.state = defaultVisSetting;
    } else {
      this.state = props.memory;  
    }
    //// HANDLER BINDINGS ////
    // general bindings
    this.handleVisActiveToggle = this.handleVisActiveToggle.bind(this);

    //class-based visualization bindings
    this.handleClassNumSelection = this.handleClassNumSelection.bind(this);
    this.handlePaletteSelection = this.handlePaletteSelection.bind(this);
    this.handleFieldSelection = this.handleFieldSelection.bind(this);
    this.handleYearSelection = this.handleYearSelection.bind(this);
    
  }

  componentDidMount(){
    var style = document.getElementById(this.props.id).style;
    style.right = '0px';
    this.props.updateVisSettingMemory(this.props.id, this.state);
  }

  componentDidUpdate(){
    this.props.updateVisSettingMemory(this.props.id, this.state);
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
    
    this.setState({
      selectedProp: defaultSelectedProp,
      fieldValue: fieldVal,
      fieldLabel: fieldLabel,
      yearValue: defaultYearVal,
      yearLabel: defaultYearLabel,
      yearOptions: defaultYearOptions,
      
      filterValid: false,
      freezeFilterValidity: false
    });
  }

  handleYearSelection(val){
    const yearVal = val.value;
    const yearLabel = val.label;
    const selectedProp = this.propRegistry[this.state.fieldValue + yearVal];

    this.setState({
      selectedProp: selectedProp,
      yearValue: yearVal,
      yearLabel: yearLabel,
      
      filterValid: false,
      freezeFilterValidity: false
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
        <div className={'validationBar validationBar-' + (this.state.visValid && this.state.visActive)} />
      </div>
    );
  }
}
 export default ClassesVisualizer;
