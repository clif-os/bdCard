import React from 'react';
import './Sidebar.styl';
import NavBar from './navBar/NavBar.jsx';
import AnalysisPane from './analysisPane/AnalysisPane.jsx';

class Sidebar extends React.Component {
  constructor(props){
    super();
  }

  render() {
    console.log('uhhhh')
    return (
      <div className="sidebar">
        <NavBar />
        <AnalysisPane />
      </div>
    );
  }
}
 export default Sidebar;