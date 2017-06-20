import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { unsplitMaps } from '../../actions/index.jsx';
import './CloseButton.styl';

function CloseButton(props) {
  const { mapSplit, dispatch, showcaseId, containerSize } = props;
  const handleClick = () => {
    dispatch(unsplitMaps(showcaseId));
  };
  if (mapSplit) {
    return (
      <button
        className={`mapShowcaser-closeButton mapShowcaser-closeButton-${containerSize} bms-button`}
        onClick={handleClick}
      >
        <span className="mapShowcaser-closeButton-icon fa fa-close" />
      </button>
    );
  }
  return null;
}

CloseButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mapSplit: PropTypes.bool.isRequired,
  showcaseId: PropTypes.string.isRequired,
  containerSize: PropTypes.string.isRequired,
};

export default connect()(CloseButton);
