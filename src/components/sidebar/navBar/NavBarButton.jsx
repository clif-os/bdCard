import React from 'react';
import './NavBarButton.styl'

function NavBarButton(props) {
  const classNameNavBarButton = 'navBarButton navBarButton-' + (props.active ? 'active' : 'inactive');
  const onClick = () => {
    props.handleClick(props.id);
  };
  return (
    <div className={classNameNavBarButton} id={props.id} onClick={onClick} data-tip={props.title} data-for='navBarTooltip'>
      <span className={props.icon} />
      <div className='hoverBox' />
      <div className='activeBarContainer'>
        <div className='activeBar'/>
      </div>
    </div>
  );
}

export default NavBarButton;