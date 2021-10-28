import React from 'react';
// import PropTypes from 'prop-types';
import { OrdDetailTable } from './';

export default function OrdMngPage() {
  return (
    <div className="home-ord-mng-page">
      <div className="home-ord-mng-page-header">
        <h1>Gestion des ordonnances</h1>
      </div>
      <OrdDetailTable
        needRadio={false}
        showNotStarted={false}
        defaultpageSize={10}
        needExpand={true}
        needShowDtl={false}
      />
    </div>
  );
}

OrdMngPage.propTypes = {};
OrdMngPage.defaultProps = {};
