import React from 'react';
import './ActiveSlider.styl'
import { guid } from '../../../../utils/generalUtils.jsx';

function ActiveSlider (props) {
  const handleClick = () => {
    props.handleActiveToggle();
  }
  return (
    <div className={'activeSlider activeSlider-' + props.active}>
      <div className='slidingContainer' onClick={handleClick}>
        <div className='slidingBead'/>
        {props.active 
          ? <span className='slider-message'>ON</span>
          : <span className='slider-message'>OFF</span>
        }
      </div>
    </div>
  );
}

export default ActiveSlider;