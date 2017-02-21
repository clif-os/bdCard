import React from 'react';
import './Header.styl'

function Header(props) {
  return (
    <div className='header'>
      <span className='header-title'>{props.title}<span className={props.icon}/></span>
    </div>
  );
}

export default Header;