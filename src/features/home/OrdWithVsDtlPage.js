import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { OrdVsBreadcrumb, OrdDetailForm, VsDetailTable, VsRdvContainer } from './';
import { useFindOrdByOrdId } from './redux/hooks';
import { Spin } from 'antd';
import { antIcon } from '../../common/constants';
import _ from 'lodash';

export default function OrdWithVsDtlPage(props) {
  const { ordonnanceId } = props;
  const { findOrdByOrdId, findOrdByOrdIdPending, findOrdByOrdIdError } = useFindOrdByOrdId();
  const [ordRecord, setOrdRecord] = useState({});
  const [showRdv, setShowRdv] = useState(false);
  const [prevCoorId, setPrevCoorId] = useState(null);
  const [version, setVersion] = useState(null);

  useEffect(() => {
    findOrdByOrdId({ ordonnanceId: ordonnanceId }).then(res => {
      setOrdRecord(res.data.ext.ordonnance);
    });
  }, [findOrdByOrdId, ordonnanceId, version]);

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
                <div>Patient: {ordRecord.patientNom}</div>
                <div>Examen médical: {ordRecord.examenMedicalNom}</div>
              </div>
              <OrdDetailForm data={ordRecord} />
              <h2 className="home-ord-with-vs-dtl-page-content-subtitle">{`Liste des visites correspondant à l'ordonnance ${ordonnanceId}`}</h2>
              <VsDetailTable
                ordRecord={ordRecord}
                target="infirmiere"
                size="small"
                pageSize={5}
                showQuickStartAndDetail={true}
                setShowRdv={setShowRdv}
                setPrevCoorId={setPrevCoorId}
              />
              {showRdv && ordRecord.ordonnanceCount > 0 && (
                <VsRdvContainer
                  restVssCount={ordRecord.ordonnanceCount}
                  data={ordRecord}
                  prevCoorId={prevCoorId}
                  setVersion={setVersion}
                />
              )}
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
