import React from 'react';
import './NavBarButton.styl';
import {VelocityTransitionGroup} from 'velocity-react';

function NavBarButton(props) {
  const classNameNavBarButton = 'navBarButton navBarButton-' + (props.active ? 'active' : 'inactive');
  let count;
  count = props.count === undefined ? 0 : props.count;
  const onClick = () => {
    props.handleClick(props.id);
  };
  return (
    <div className={classNameNavBarButton} id={props.id} onClick={onClick} data-tip={props.title} data-for='navBarTooltip'>
      <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{animation: "transition.slideLeftIn", duration: 200}}
            leave={{animation: "transition.slideLeftOut", duration: 200}}
          >
      {(count > 0 && ! props.active)
        ? <div className='navBarButton-count'>{count}</div>
        : null
      }
      </VelocityTransitionGroup>
      {props.loading
        ? <div className="loadingSpinner-small" />
        : null
      }
      <span className={props.icon} />
      <div className='hoverBox' />
      <div className='activeBarContainer'>
        <div className='activeBar'/>
      </div>
    </div>
  );
}



export default NavBarButton;