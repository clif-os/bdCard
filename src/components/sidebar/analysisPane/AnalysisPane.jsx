import './AnalysisPane.styl';
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