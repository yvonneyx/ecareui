import React from 'react';
// import PropTypes from 'prop-types';
import { Result, Button } from 'antd';

export default function Unauthorized() {
  return (
    <div className="common-unauthorized">
      <Result
        status="403"
        title="403"
        subTitle="Désolé, vous n'êtes pas autorisé à accéder à cette page."
        extra={<Button type="primary">Retour Accueil</Button>}
      />
    </div>
  );
}

Unauthorized.propTypes = {};
Unauthorized.defaultProps = {};
