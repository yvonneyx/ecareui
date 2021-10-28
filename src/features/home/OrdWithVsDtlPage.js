import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { OrdVsBreadcrumb, OrdDetailForm, VsDetailTable } from './';
import { useFindOrdByOrdId } from './redux/hooks';
import { Spin } from 'antd';
import { antIcon } from '../../common/constants';
import _ from 'lodash';

export default function OrdWithVsDtlPage(props) {
  const { ordonnanceId } = props;
  const { findOrdByOrdId, findOrdByOrdIdPending, findOrdByOrdIdError } = useFindOrdByOrdId();
  const [ordRecord, setOrdRecord] = useState({});

  useEffect(() => {
    findOrdByOrdId({ ordonnanceId: ordonnanceId }).then(res => {
      setOrdRecord(res.data.ext.ordonnance);
    });
  }, [findOrdByOrdId, ordonnanceId]);

  return (
    <div className="home-ord-with-vs-dtl-page">
      <OrdVsBreadcrumb {...props} />
      <div className="home-ord-with-vs-dtl-page-header">
        <h1>{`Détails de l'ordonnance ${ordonnanceId}`}</h1>
      </div>
      <Spin tip="Chargement en cours..." spinning={findOrdByOrdIdPending} indicator={antIcon}>
        {!findOrdByOrdIdError ? (
          !_.isEmpty(ordRecord) &&
          (ordRecord.isDeleted === 'N' ? (
            <div className="home-ord-with-vs-dtl-page-content">
              <div className="home-ord-with-vs-dtl-page-content-basic-info">
                <h3>Patient: {ordRecord.patientNom}</h3>
                <h3>Examen médical: {ordRecord.examenMedicalNom}</h3>
              </div>
              <OrdDetailForm data={ordRecord} />
              <h2 className="home-ord-with-vs-dtl-page-content-subtitle">{`Liste des visites correspondant à l'ordonnance ${ordonnanceId}`}</h2>
              <VsDetailTable
                ordRecord={ordRecord}
                target="infirmiere"
                size="small"
                pageSize={5}
                showQuickStartAndDetail={true}
                needShowDtl={true}
              />
            </div>
          ) : (
            <div className="error">
              Malheureusement, cette visite a été supprimée et ne peut pas être consultée.
            </div>
          ))
        ) : (
          <div className="error">Échec du chargement des données</div>
        )}
      </Spin>
    </div>
  );
}

OrdWithVsDtlPage.propTypes = {};
OrdWithVsDtlPage.defaultProps = {};
