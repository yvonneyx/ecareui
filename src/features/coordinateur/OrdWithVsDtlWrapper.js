import React from 'react';
// import PropTypes from 'prop-types';
import { OrdWithVsDtlPage } from '../home';

export default function OrdWithVsDtlWrapper(props) {
  const ordonnanceId = props.match.params.ordonnanceId;
  const userType = props.match.path.split('/')[1];

  return (
    <div className="coordinateur-ord-with-vs-dtl-wrapper">
      <OrdWithVsDtlPage ordonnanceId={ordonnanceId} userType={userType}/>
    </div>
  );
}

OrdWithVsDtlWrapper.propTypes = {};
OrdWithVsDtlWrapper.defaultProps = {};
