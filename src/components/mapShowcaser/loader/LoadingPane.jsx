import React, { PropTypes } from 'react';
import './LoadingPane.styl';

function LoadingPane(props) {
  const { active } = props;
  const activeClass = active ? 'active' : 'inactive';
  return (
    <div id="mainLoadingPane" className={`loadingPane loadingPane-${activeClass}`}>
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
};

export default LoadingPane;
