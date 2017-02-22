import React from 'react';
import './OnOffSlider.styl'
import { guid } from '../../../../utils/generalUtils.jsx';

function OnOffSlider (props) {
  const handleClick = () => {
    props.handleFilterOnOff();
  }
  return (
    <div className={'onOffSlider onOffSlider-' + (props.active ? 'on' : 'off')}>
      <div className='slidingContainer' onClick={handleClick}>
        <div className='slidingBead'/>
      </div>
    </div>
  );
}

export default OnOffSlider;