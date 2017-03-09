import './AnalysisPane.styl';
import 'react-select/dist/react-select.css';
import React from 'react';
import FiltersSection from './filters/FiltersSection.jsx';
import VisualizationSection from './visualization/VisualizationSection.jsx';

class AnalysisPane extends React.Component {
  constructor(props){
    super();
  }

  render() {
    return (
      <div className="analysisPane sidebarPane">
        <FiltersSection propsMd={this.props.propsMd} />
        
      </div>
    );
  }
}
 export default AnalysisPane;

 //<VisualizationSection propsMd={this.props.propsMd} />