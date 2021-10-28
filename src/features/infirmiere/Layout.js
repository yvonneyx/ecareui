import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { SidePanel } from './';

export default function Layout({ children }) {
  return (
    <div className="infirmiere-layout">
      <SidePanel />
      <div className="infirmiere-page-container">{children}</div>
    </div>
  );
};

Layout.propTypes = {};
Layout.defaultProps = {};
