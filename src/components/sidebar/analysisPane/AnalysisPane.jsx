import './AnalysisPane.styl';
import 'react-select/dist/react-select.css';
import React from 'react';
import FiltersSection from './filters/FiltersSection.jsx';

class AnalysisPane extends React.Component {
  constructor(props){
    super();
  }

  render() {
    return (
      <div className="analysisPane sidebarPane">
        <FiltersSection />
        
      </div>
    );
  }
}
 export default AnalysisPane;