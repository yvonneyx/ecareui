import React from 'react';
// import PropTypes from 'prop-types';
import { SidePanel } from './';

export default function Layout({ children }) {
  return (
    <div className="coordinateur-layout">
      <SidePanel />
      <div className="coordinateur-page-container">{children}</div>
    </div>
  );
};

Layout.propTypes = {};
Layout.defaultProps = {};
