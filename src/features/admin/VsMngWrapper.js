import React from 'react';
// import PropTypes from 'prop-types';
import VsMngPage from '../home/VsMngPage';

export default function VsMngWrapper(props) {
  const visiteId = props.match.params.visiteId;

  return (
    <div className="admin-vs-mng-wrapper">
      <VsMngPage visiteId={visiteId}/>
    </div>
  );
};

VsMngWrapper.propTypes = {};
VsMngWrapper.defaultProps = {};
