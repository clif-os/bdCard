import './VisualizationPane.styl';
import 'react-select/dist/react-select.css';
import React from 'react';
import VisualizationSection from './visualization/VisualizationSection.jsx';

class VisualizationPane extends React.Component {
  constructor(props){
    super();
  }

  render() {
    return (
      <div className="visualizationPane sidebarPane">
        <VisualizationSection propsMd={this.props.propsMd} /> 
      </div>
    );
  }
}
 export default VisualizationPane;

 //<VisualizationSection propsMd={this.props.propsMd} />