import React from 'react';
import './ActiveSlider.styl'
import { guid } from '../../../../utils/generalUtils.jsx';

function ActiveSlider (props) {
  const handleClick = () => {
    props.handleFilterActiveToggle();
  }
  return (
    <div className={'activeSlider activeSlider-' + props.active}>
      <div className='slidingContainer' onClick={handleClick}>
        <div className='slidingBead'/>
      </div>
    </div>
  );
}

export default ActiveSlider;