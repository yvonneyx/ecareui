import React from 'react';
// import PropTypes from 'prop-types';
import { SingleVsDtlPage } from '../home';

export default function SingleVsDtlWrapper(props) {
  const ordonnanceId = props.match.params.ordonnanceId;
  const visiteId = props.match.params.visiteId;
  const userType = props.match.path.split('/')[1];

  return (
    <div className="infirmiere-single-vs-dtl-wrapper">
      <SingleVsDtlPage
        ordonnanceId={ordonnanceId}
        visiteId={visiteId}
        userType={userType}
        target="infirmiere"
      />
    </div>
  );
}

SingleVsDtlWrapper.propTypes = {};
SingleVsDtlWrapper.defaultProps = {};
