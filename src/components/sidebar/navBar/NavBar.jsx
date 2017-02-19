import './NavBar.styl';
import React from 'react';
import NavBarButton from './NavBarButton.jsx';

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
      };
    }
  }

  render() {
    return (
      <div className="navBar">
        <NavBarButton id='navButtonHome' icon='fa fa-home' handleClick={this.handleClick} active={this.state.activeButtonId === 'navButtonHome'} />
        <NavBarButton id='navButtonSliders' icon='fa fa-sliders' handleClick={this.handleClick} active={this.state.activeButtonId === 'navButtonSliders'} />
      </div>
    );
  }
}
 export default NavBar;