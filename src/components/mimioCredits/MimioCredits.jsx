import React from 'react';
import PropTypes from 'prop-types';
import './MimioCredits.styl';

function MimioCredits(props) {
  const { mapSplit } = props;
  return (
    <div className={`mimioCredits-container mimioCredits-container-mapSplit-${mapSplit}`}>
      <a href="http://www.mimio.io/" target="_blank" rel="noopener noreferrer">
        <button className="mimioCredits-website mimioCredits-button">
          <span className="mimioCredits-website-text">
            <span className="mimioCredits-website-icon mimioCredits-icon fa fa-globe" /> MIMIO
          </span>
        </button>
      </a>
      <a href="https://github.com/mimio/basemapShowcase" target="_blank" rel="noopener noreferrer">
        <button className="mimioCredits-github mimioCredits-button">
          <span className="mimioCredits-github-icon mimioCredits-icon fa fa-github" />
        </button>
      </a>
    </div>
  );
}

MimioCredits.propTypes = {
  mapSplit: PropTypes.bool.isRequired,
};

export default MimioCredits;
