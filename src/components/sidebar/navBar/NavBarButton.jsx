import React from 'react';
import './NavBarButton.styl'

function NavBarButton(props) {
  const className = 'navBarButton navBarButton-' + (props.active ? 'active' : 'inactive');
  const onClick = () => {
    props.handleClick(props.id);
  };
  return (
    <div className={className} onClick={onClick}>
      <span className={props.icon} />
    </div>
  );
}

export default NavBarButton;