import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import {
  OrdVsBreadcrumb,
  VsPatientPeForm,
  VsDetailForm,
  VsPatientEmForm,
  VsPatientConForm,
} from './';
import { Button, Form, Divider, Spin } from 'antd';
import { useUpdateVisite, useFindVsByVsId } from './redux/hooks';
import { antIcon } from '../../common/constants';
import { useCookies } from 'react-cookie';
import { EditOutlined, SaveOutlined, ReadOutlined } from '@ant-design/icons';

export default function SingleVsDtlPage(props) {
  const { visiteId, target } = props;
  const { findVsByVsId, findVsByVsIdPending, findVsByVsIdError } = useFindVsByVsId();
  const { updateVisite, updateVisitePending, updateVisiteError } = useUpdateVisite();
  const [foundVs, setFoundVs] = useState({});
  const [editable, setEditable] = useState(false);
  const [rcForm] = Form.useForm();
  const [cookies] = useCookies(['UID', 'UNAME', 'UROLE']);

  useEffect(() => {
    findVsByVsId({
      visiteId: visiteId,
    }).then(res => {
      console.log(res.data.ext.visite);
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
        modificateurRecent: cookies.UID,
      });
    } else if (vsStatus === 'done') {
      updateVisite({
        visiteId: vsId,
        visiteHeureFin: new Date(),
        visiteEtat: 2,
        visiteObservation: rc.observation,
        modificateurRecent: cookies.UID,
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
              {target !== 'infirmiere' && <div>Infirmiere: {foundVs.infirmiereNom}</div>}
              <div>Patient: {foundVs.patientNom}</div>
              <div>Coordinateur: {foundVs.coordinateurNom}</div>
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
                <div className="visite-record">
                  <div className="btns-container">
                    {!editable && (
                      <Button onClick={() => setEditable(true)} icon={<EditOutlined />}>
                        Mode Édition
                      </Button>
                    )}
                    {editable && (
                      <Button onClick={() => setEditable(false)} icon={<ReadOutlined />}>
                        Mode Lecture seule
                      </Button>
                    )}
                    <Button icon={<SaveOutlined />}>Enregistrer</Button>
                  </div>
                  <VsPatientPeForm visiteId={foundVs.visiteId} editable={editable} />
                  <VsPatientEmForm visiteId={foundVs.visiteId} editable={editable} />
                  <VsPatientConForm editable={editable} />
                  {updateVisiteError && <div className="error btn-error">Mise à jour a échoué</div>}
                </div>
                <Button
                  type="primary"
                  size="large"
                  className="home-single-vs-dtl-page-content-btn slide-btn"
                  onClick={() => doUpdateVisite(foundVs.visiteId, 'done')}
                  loading={updateVisitePending}
                >
                  Mettre fin à la surveillance
                </Button>
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
