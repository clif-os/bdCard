import './FilterPane.styl';
import 'react-select/dist/react-select.css';
import React from 'react';
import FiltersSection from './filters/FiltersSection.jsx';

// keeping header united with the filter logic for now since the adding and subtracting of filters has repurcussions for the header 

class FilterPane extends React.Component {
  constructor(props){
    super();
  }

  render() {
    console.log(this.props.memory)
    return (
      <div className="filterPane sidebarPane">
        <FiltersSection propsMd={this.props.propsMd} transitionDuration={this.props.transitionDuration} handleCountUpdate={this.props.handleCountUpdate} memory={this.props.memory} updateMasterMemory={this.props.updateMasterMemory}/>
      </div>
    );
  }
}
 export default FilterPane;

 //<VisualizationSection propsMd={this.props.propsMd} />