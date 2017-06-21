import React from 'react';
import PropTypes from 'prop-types';
import './MimioCredits.styl';

function MimioCredits(props) {
  const { mapSplit } = props;
  return (
    <a href="http://www.mimio.io/" target="_blank" rel="noopener noreferrer">
      <button className={`mimioCredits mimioCredits-mapSplit-${mapSplit}`}>
        <span className="mimioCredits-text"><span className="mimioCredits-text-icon fa fa-globe" /> MIMIO</span>
      </button>
    </a>
  );
}

MimioCredits.propTypes = {
  mapSplit: PropTypes.bool.isRequired,
};

export default MimioCredits;
