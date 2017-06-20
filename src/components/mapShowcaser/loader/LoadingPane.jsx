import React from 'react';
import PropTypes from 'prop-types';
import './LoadingPane.styl';

function LoadingPane(props) {
  const { active } = props;
  const activeClass = active ? 'active' : 'inactive';
  return (
    <div id="mainLoadingPane" className={`loadingPane loadingPane-${activeClass}`}>
      <div className="loadingPane-spinner" />
    </div>
  );
}

LoadingPane.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default LoadingPane;
