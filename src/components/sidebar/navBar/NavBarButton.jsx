import React from 'react';
import './NavBarButton.styl'

function NavBarButton(props) {
  const classNameNavBarButton = 'navBarButton navBarButton-' + (props.active ? 'active' : 'inactive');
  const classNameActiveBar = 'activeBar activeBar-' + (props.active ? 'active' : 'inactive');
  const onClick = () => {
    props.handleClick(props.id);
  };
  return (
    <div className={classNameNavBarButton} onClick={onClick}>
      <span className={props.icon} />
      <div className='hoverBox' />
      <div className='activeBarContainer'>
        <div className={classNameActiveBar}/>
      </div>
    </div>
  );
}

export default NavBarButton;