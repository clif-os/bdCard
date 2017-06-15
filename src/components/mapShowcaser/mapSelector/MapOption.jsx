import React, { PropTypes } from 'react';
import './MapOption.styl';

function MapOption(props) {
  const { nodeId, handleChoice, chosen, optionChosen,
          title, description, imgUrl, optionData } = props;
  const hClick = () => {
    handleChoice(optionData, nodeId);
  };
  
  let chosenClass;
  if (optionChosen) {
    if (chosen) {
      chosenClass = 'chosen';
    } else {
      chosenClass = 'notChosen';
    }
  } else {
    chosenClass = 'resting';
  };

  return (
    <button className={`mapOption mapOption-${chosenClass}`} id={`mapOption-${nodeId}`} onClick={hClick} >
      <div className="mapOption-info">
        <div className="mapOption-title-container">
          {title}
        </div>
        <div className="mapOption-underline-container">
          <div className="mapOption-underline" />
        </div>
        <div className="mapOption-description-container">
          {description}
        </div>
      </div>
      <img className="mapOption-image" src={imgUrl} alt={title} />
    </button>
  );
}

MapOption.propTypes = {
  nodeId: PropTypes.number.isRequired,
  handleChoice: PropTypes.func.isRequired,
  chosen: PropTypes.bool.isRequired,
  optionChosen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  optionData: PropTypes.object.isRequired,
};

      // <div className="mapOption-selectionMask-container" >
      //   <div className="mapOption-selectionMask" />
      // </div>

export default MapOption;
