import React from 'react';
// import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';

export default function OrdVsBreadcrumb(props) {
  const { ordonnanceId, visiteId, userType } = props;

  return (
    <div className="home-ord-vs-breadcrumb">
      <Breadcrumb>
        <Breadcrumb.Item><a href={`/${userType}/gestion-des-ordonnances`}>Ordonnances</a></Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href={`/${userType}/ordonnance/${ordonnanceId}`}>{`Ordonnance [${ordonnanceId}]`}</a>
        </Breadcrumb.Item>
        {visiteId && <Breadcrumb.Item>
          <a href={`/${userType}/ordonnance/${ordonnanceId}/visite/${visiteId}`}>{`Visite [${visiteId}]`}</a>
        </Breadcrumb.Item>}
      </Breadcrumb>,
    </div>
  );
};

OrdVsBreadcrumb.propTypes = {};
OrdVsBreadcrumb.defaultProps = {};
