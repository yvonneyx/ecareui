import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { OrdVsBreadcrumb } from './';
import VsDetailForm from './VsDetailForm';
import { Button, Form, Col, Row, Input, Divider, Spin } from 'antd';
import { useUpdateVisite, useFindVsByVsId } from './redux/hooks';
import { antIcon } from '../../common/constants';

export default function SingleVsDtlPage(props) {
  const { visiteId } = props;
  const { findVsByVsId, findVsByVsIdPending, findVsByVsIdError } = useFindVsByVsId();
  const { updateVisite, updateVisitePending, updateVisiteError } = useUpdateVisite();
  const [foundVs, setFoundVs] = useState({});
  const [rcForm] = Form.useForm();

  useEffect(() => {
    findVsByVsId({
      visiteId: visiteId,
    }).then(res => {
      setFoundVs(res.data.ext.visite);
    });
  }, [findVsByVsId, visiteId]);

  const doUpdateVisite = (vsId, vsStatus) => {
    const rc = rcForm.getFieldsValue();
    if (vsStatus === 'doing') {
      updateVisite({
        visiteId: vsId,
        visiteDate: new Date(),
        visiteHeureDebut: new Date(),
        visiteEtat: 1,
        modificateurRecent: 1, //todo: loggedId - userId
      });
    } else if (vsStatus === 'done') {
      updateVisite({
        visiteId: vsId,
        visiteHeureFin: new Date(),
        visiteEtat: 2,
        visiteObservation: rc.observation,
        modificateurRecent: 1, //todo: loggedId - userId
      });
    }
  };

  return (
    <div className="home-single-vs-dtl-page">
      <OrdVsBreadcrumb {...props} />
      <div className="home-single-vs-dtl-page-header">
        <h1>{`Détails de la visite ${foundVs.visiteId}`}</h1>
      </div>
      <Spin tip="Chargement en cours..." spinning={findVsByVsIdPending} indicator={antIcon}>
        {foundVs && foundVs.isDeleted === 'N' ? (
          <div className="home-single-vs-dtl-page-content">
            <div className="home-single-vs-dtl-page-content-basic-info">
              <h3>Infirmiere: {foundVs.infirmiereId}</h3>
              <h3>Patient: {foundVs.patientId}</h3>
              <h3>Coordinateur: {foundVs.coordinateurId}</h3>
            </div>
            <VsDetailForm data={foundVs} />
            {foundVs.visiteEtat === 0 && (
              <div>
                <Button
                  type="primary"
                  size="large"
                  className="home-single-vs-dtl-page-content-btn slide-btn"
                  onClick={() => doUpdateVisite(foundVs.visiteId, 'doing')}
                  loading={updateVisitePending}
                >
                  Démarrer la surveillance
                </Button>
                {updateVisiteError && <div className="error btn-error">Mise à jour a échoué</div>}
              </div>
            )}
            {foundVs.visiteEtat === 1 && (
              <div>
                <Form layout="horizontal" className="visite-record" form={rcForm}>
                  <Row gutter={24}>
                    <Col span={24} key="ob">
                      <Form.Item label="Conclusion de l'observation" name="observation">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                <Button
                  type="primary"
                  size="large"
                  className="home-single-vs-dtl-page-content-btn slide-btn"
                  onClick={() => doUpdateVisite(foundVs.visiteId, 'done')}
                  loading={updateVisitePending}
                >
                  Mettre fin à la surveillance et soumettre les résultats de l'observation
                </Button>
                {updateVisiteError && <div className="error btn-error">Mise à jour a échoué</div>}
              </div>
            )}
            {foundVs.visiteEtat === 2 && (
              <div>
                <Divider />
              </div>
            )}
          </div>
        ) : (
          <div className="error">
            Malheureusement, cette visite a été supprimée et ne peut pas être consultée.
          </div>
        )}
      </Spin>
      <div className="home-single-vs-dtl-page-footer">
        {findVsByVsIdError && <div className="error">Échec du chargement des données</div>}
      </div>
    </div>
  );
}

SingleVsDtlPage.propTypes = {};
SingleVsDtlPage.defaultProps = {};
