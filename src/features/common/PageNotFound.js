import React from 'react';
import { Button } from 'antd';

export default function PageNotFound() {
  return (
    <div className="common-page-not-found">
      <img src={require('../../images/undraw_page_not_found.svg')}/>
      <div>Page not found.</div>
      <Button type="primary">Retour Accueil</Button>
    </div>
  );
}
