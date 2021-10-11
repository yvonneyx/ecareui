import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { SingleVsDtlPage } from '../home';

export default function SingleVsDtlWrapper() {
  const location = useLocation();
  return (
    <div className="coordinateur-single-vs-dtl-wrapper">
      <SingleVsDtlPage />
    </div>
  );
}

SingleVsDtlWrapper.propTypes = {};
SingleVsDtlWrapper.defaultProps = {};
