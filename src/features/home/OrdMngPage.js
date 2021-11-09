import React from 'react';
// import PropTypes from 'prop-types';
import { OrdDetailTable } from './';

export default function OrdMngPage() {
  return (
    <div className="home-ord-mng-page">
      <div className="home-ord-mng-page-header">
        <h1>Ordonnances</h1>
      </div>
      <OrdDetailTable
        needRadio={false}
        ordsNotStarted={false}
        defaultpageSize={10}
        needExpand={true}
        needShowDtl={false}
      />
    </div>
  );
}

OrdMngPage.propTypes = {};
OrdMngPage.defaultProps = {};
