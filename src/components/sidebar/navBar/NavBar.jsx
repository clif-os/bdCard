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
      } else if (id === 'navButtonFilter'){
        this.props.handleClick('filter');
      } else if (id === 'navButtonPaint'){
        this.props.handleClick('visualize');
      } else if (id === 'navButtonDownloads'){
        this.props.handleClick('downloads');
      }
    }
  }

  render() {
    return (
      <div className="navBar">
        <NavBarButton id='navButtonHome' title='Home' icon='fa fa-home' handleClick={this.handleClick} active={this.state.activeButtonId === 'navButtonHome'} />
        <NavBarButton id='navButtonFilter' count={this.props.counts.filter} title='Filter Settings' icon='fa fa-filter' handleClick={this.handleClick} active={this.state.activeButtonId === 'navButtonFilter'} />
        <NavBarButton id='navButtonPaint' title='Visualization Settings' icon='fa fa-paint-brush' handleClick={this.handleClick} active={this.state.activeButtonId === 'navButtonPaint'} />
        <NavBarButton id='navButtonDownloads' title='Downloads' icon='fa fa-download' handleClick={this.handleClick} active={this.state.activeButtonId === 'navButtonDownloads'} />
      </div>
    );
  }
}
 export default NavBar;

 // <ReactTooltip id='navBarTooltip' type='info' effect='solid' className='navBarTooltip' offset={{'left': 5}}/>