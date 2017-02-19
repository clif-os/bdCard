import './NavBar.styl';
import React from 'react';

class NavBar extends React.Component {
  constructor(props){
    super();
  }

  render() {
    return (
      <div className="navBar">
        <span className="fa fa-home" />
        <span className="fa fa-home" />
      </div>
    );
  }
}
 export default NavBar;