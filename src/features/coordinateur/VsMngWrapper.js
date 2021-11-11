import React from 'react';
// import PropTypes from 'prop-types';
import { VsMngPage } from '../home';

export default function VsMngWrapper(props) {
  const visiteId = props.match.params.visiteId;

  return (
    <div className="coordinateur-vs-mng-wrapper">
      <VsMngPage visiteId={visiteId}/>
    </div>
  );
};

VsMngWrapper.propTypes = {};
VsMngWrapper.defaultProps = {};
