import './FilterPane.styl';
import 'react-select/dist/react-select.css';
import React from 'react';
import FiltersSection from './filters/FiltersSection.jsx';

class FilterPane extends React.Component {
  constructor(props){
    super();
  }

  render() {
    return (
      <div className="filterPane sidebarPane">
        <FiltersSection propsMd={this.props.propsMd} transitionDuration={this.props.transitionDuration} />
      </div>
    );
  }
}
 export default FilterPane;

 //<VisualizationSection propsMd={this.props.propsMd} />