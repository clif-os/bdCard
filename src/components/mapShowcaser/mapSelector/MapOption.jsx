import React from 'react';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';
import './MapOption.styl';

function MapOption(props) {
  const { handleChoice, chosen, title, description,
          imgUrl, optionId, optionData, showcaseId,
          optionSize, containerSize } = props;
  const hClick = () => {
    if (!chosen) {
      handleChoice(optionId, optionData);
    }
  };

  let chosenClass;
  if (chosen) {
    chosenClass = 'chosen';
  } else {
    chosenClass = 'notChosen';
  }

  console.log({props})

  return (
    <ContainerDimensions>
      <button className={`mapOption mapOption-${showcaseId} mapOption-containerSize-${containerSize} mapOption-${optionSize} mapOption-${chosenClass}`} onClick={hClick} >
        <div className="mapOption-info">
          {chosen
            ? <span className="mapOption-chosenIcon fa fa-check-circle-o" />
            : null
          }
          <div className="mapOption-title-container">
            <span>{title}</span>
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
    </ContainerDimensions>
  );
}

MapOption.propTypes = {
  handleChoice: PropTypes.func.isRequired,
  showcaseId: PropTypes.string.isRequired,
  chosen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  optionId: PropTypes.string.isRequired,
  optionData: PropTypes.object.isRequired,
  optionSize: PropTypes.string.isRequired,
  containerSize: PropTypes.string.isRequired,
};

export default MapOption;
