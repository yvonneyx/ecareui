import React from 'react';
// import PropTypes from 'prop-types';
import { SidePanel } from './';

export default function Layout({ children }) {
  return (
    <div className="admin-layout">
      <SidePanel />
      <div className="admin-page-container">{children}</div>
    </div>
  );
};

Layout.propTypes = {};
Layout.defaultProps = {};
