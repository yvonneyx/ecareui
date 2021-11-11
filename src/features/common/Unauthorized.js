import React from 'react';
// import PropTypes from 'prop-types';
import { Button } from 'antd';

export default function Unauthorized() {
  return (
    <div className="common-unauthorized">
      <img src={require('../../images/undraw_authentication.svg')} alt="403" />
      <div>Désolé, vous n'êtes pas autorisé à accéder à cette page.</div>
      <Button type="primary" href={`/`}>
        Retour Accueil
      </Button>
    </div>
  );
}

Unauthorized.propTypes = {};
Unauthorized.defaultProps = {};
