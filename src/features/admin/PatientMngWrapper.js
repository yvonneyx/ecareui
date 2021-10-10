import React from 'react';
// import PropTypes from 'prop-types';
import { PatientMngPage } from '../home';

export default function PatientMngWrapper() {
  return (
    <div className="admin-patient-mng-wrapper">
      <PatientMngPage />
    </div>
  );
};

PatientMngWrapper.propTypes = {};
PatientMngWrapper.defaultProps = {};
