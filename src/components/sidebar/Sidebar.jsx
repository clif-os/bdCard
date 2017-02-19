import React from 'react';
import './Sidebar.styl';
import NavBar from './navBar/NavBar.jsx';
import AnalysisPane from './analysisPane/AnalysisPane.jsx';
import HomePane from './homePane/HomePane.jsx';

class Sidebar extends React.Component {
  constructor(props){
    super();
    this.state = {
      activePane: 'home'
    }
    this.handleNavBarClick = this.handleNavBarClick.bind(this);
  }

  handleNavBarClick(paneId){
    this.setState({
      activePane: paneId
    });
  }

  render() {
    console.log('uhhhh')
    return (
      <div className="sidebar">
        <NavBar handleClick={this.handleNavBarClick}/>
        {this.renderActivePane()}
      </div>
    );
  }

  renderActivePane(){
    switch(this.state.activePane){
      case'home':
        console.log('home')
        return <HomePane />;
      case 'analysis':
        return <AnalysisPane/>;
      default:
        return <HomePane />;
    }
  }
}
 export default Sidebar;