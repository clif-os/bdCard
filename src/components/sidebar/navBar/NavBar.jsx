import './NavBar.styl';
import React from 'react';
import NavBarButton from './NavBarButton.jsx';
import ReactTooltip from 'react-tooltip';

class NavBar extends React.Component {
  constructor(props){
    super();
    this.state = {
      activeButtonId: 'navButtonHome'
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(id){
    if (id !== this.state.activeButtonId){
      this.setState({
        activeButtonId: id
      });
      if (id === 'navButtonHome'){
        this.props.handleClick('home');
      } else if (id === 'navButtonSliders'){
        this.props.handleClick('analysis');
      } else if (id === 'navButtonSettings'){
        this.props.handleClick('settings');
      }
    }
  }

  render() {
    return (
      <div className="navBar">
        <NavBarButton id='navButtonHome' title='Home' icon='fa fa-home' handleClick={this.handleClick} active={this.state.activeButtonId === 'navButtonHome'} />
        <NavBarButton id='navButtonSliders' title='Analysis' icon='fa fa-sliders' handleClick={this.handleClick} active={this.state.activeButtonId === 'navButtonSliders'} />
        <NavBarButton id='navButtonSettings' title='Settings' icon='fa fa-gear' handleClick={this.handleClick} active={this.state.activeButtonId === 'navButtonSettings'} />
        <ReactTooltip id='navBarTooltip' type='info' effect='solid' className='navBarTooltip' offset={{'left': 5}}/>
      </div>
    );
  }
}
 export default NavBar;