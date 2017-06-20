import React from 'react';
import PropTypes from 'prop-types';
import './LoadingPane.styl';

function LoadingPane(props) {
  const { active, mapSplit } = props;
  const activeClass = active ? 'active' : 'inactive';
  return (
    <div id="mainLoadingPane" className={`loadingPane loadingPane-${activeClass} loadingPane-mapSplit-${mapSplit}`}>
      <div className="loadingBar-container" >
        <div className="loadingBar" />
      </div>
      <div className="loadingBar-container" >
        <div className="loadingBar-backdrop" />
      </div>
    </div>
  );
}

LoadingPane.propTypes = {
  active: PropTypes.bool.isRequired,
  mapSplit: PropTypes.bool.isRequired,
};

export default LoadingPane;
