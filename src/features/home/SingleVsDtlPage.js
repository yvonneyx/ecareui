import React, { useEffect, useState, useRef } from 'react';
// import PropTypes from 'prop-types';
import {
  OrdVsBreadcrumb,
  VsPatientPeForm,
  VsDetailForm,
  VsPatientEmForm,
  VsPatientConForm,
} from './';
import { Button, Form, Modal, Spin } from 'antd';
import {
  useUpdateVisite,
  useFindVsByVsId,
  useUpdatePeByVsIdAndPid,
  useAddPeByVsIdAndPid,
  useUpdateEmByVsId,
  useAddEmByVsId,
  useFindOrdByOrdId,
  useUpdateOrdonnance,
} from './redux/hooks';
import { antIcon } from '../../common/constants';
import { useCookies } from 'react-cookie';
import { EditOutlined, SaveOutlined, ReadOutlined } from '@ant-design/icons';
import _ from 'lodash';
export default function SingleVsDtlPage(props) {
  const { visiteId, target } = props;
  const { findVsByVsId, findVsByVsIdPending, findVsByVsIdError } = useFindVsByVsId();
  const { updateVisite, updateVisitePending, updateVisiteError } = useUpdateVisite();
  const { findOrdByOrdId } = useFindOrdByOrdId();
  const { updateOrdonnance } = useUpdateOrdonnance();
  const { updatePeByVsIdAndPid } = useUpdatePeByVsIdAndPid();
  const { addPeByVsIdAndPid } = useAddPeByVsIdAndPid();
  const { updateEmByVsId } = useUpdateEmByVsId();
  const { addEmByVsId } = useAddEmByVsId();
  const [foundVs, setFoundVs] = useState({});
  const [editable, setEditable] = useState(false);
  const [shouldSave, setShouldSave] = useState(false);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showRdv, setShowRdv] = useState(false);
  const peFormRef = useRef(null);
  const emFormRef = useRef(null);
  const conFormRef = useRef(null);

  const [cookies] = useCookies(['UID', 'UNAME', 'UROLE']);

  let peVersion = 0;

  useEffect(() => {
    findVsByVsId({
      visiteId: visiteId,
    }).then(res => {
      setFoundVs(res.data.ext.visite);
    });
  }, [findVsByVsId, visiteId, version]);

  const hanldeUpdateVisite = (vsId, vsStatus) => {
    let conValues = conFormRef.current && conFormRef.current.getFieldsValue();

    if (shouldSave) {
      onCommit();
    }
    if (vsStatus === 'doing') {
      updateVisite({
        visiteId: vsId,
        visiteDate: new Date(),
        visiteHeureDebut: new Date(),
        visiteEtat: 1,
        modificateurRecent: cookies.UID,
      }).then(() => {
        setVersion(new Date());
      });
    } else if (vsStatus === 'done') {
      updateVisite({
        visiteId: vsId,
        visiteHeureFin: new Date(),
        visiteEtat: 2,
        visiteObservation: conValues.observation,
        modificateurRecent: cookies.UID,
      }).then(() => {
        setVersion(new Date());
      });
      findOrdByOrdId({
        ordonnanceId: foundVs.ordonnanceId,
      }).then(res => {
        let restVssCount = res.data.ext.ordonnance.ordonnanceCount;
        let newRestVssCount = restVssCount - 1;
        updateOrdonnance({
          ordonnanceId: foundVs.ordonnanceId,
          ordonnanceCount: newRestVssCount,
        });
        if (newRestVssCount !== 0) {
          setShowRdv(true);
        }
      });
    }
  };

  const onCommit = () => {
    let peValues = peFormRef.current && peFormRef.current.getFieldsValue();
    let emPartValues = emFormRef.current && emFormRef.current.getFieldsValue();
    let hasPaid = emFormRef.current && emFormRef.current.hasPaid;
    let conValues = conFormRef.current && conFormRef.current.getFieldsValue();

    peFormRef.current && peFormRef.current.setPeData(peValues);
    emFormRef.current &&
      emFormRef.current.setEmData({ ...emPartValues, examenMedicalPayee: hasPaid });
    conFormRef.current && conFormRef.current.setConData(conValues);
  };

  const onSave = () => {
    let peValues = peFormRef.current && peFormRef.current.getFieldsValue();
    let pePrevValues = peFormRef.current && peFormRef.current.pePrevValues;

    let emPartValues = emFormRef.current && emFormRef.current.getFieldsValue();
    let hasPaid = emFormRef.current && emFormRef.current.hasPaid;
    let emPrevValues = emFormRef.current && emFormRef.current.emPrevValues;

    let patientDetailId = peFormRef.current && peFormRef.current.patientDetailId;
    let visiteDetailId = emFormRef.current && emFormRef.current.visiteDetailId;
    let conValues = conFormRef.current && conFormRef.current.getFieldsValue();

    // patient physical exam record

    if (patientDetailId) {
      if (!_.isEqual(pePrevValues, peValues)) {
        updatePeByVsIdAndPid({
          patientDetailId: patientDetailId,
          patientId: foundVs.patientId,
          visiteId: foundVs.visiteId,
          ...peValues,
        });
      }
    } else {
      addPeByVsIdAndPid({
        patientId: foundVs.patientId,
        visiteId: foundVs.visiteId,
        ...peValues,
      });
    }

    // examen medical record
    const emPartPrevValues =
      !_.isEmpty(emPrevValues) &&
      _.pick(emPrevValues, [
        'examenMedicalNom',
        'examenMedicalResult',
        'examenMedicalStatus',
        'examenMedicalPayee',
      ]);

    if (visiteDetailId) {
      if (!_.isEqual(emPartPrevValues, { ...emPartValues, examenMedicalPayee: hasPaid })) {
        updateEmByVsId({
          visiteDetailId: visiteDetailId,
          visiteId: foundVs.visiteId,
          ...emPartValues,
          examenMedicalId: foundVs.examId,
          examenMedicalPayee: hasPaid ? 'Y' : 'N',
        });
      }
    } else {
      addEmByVsId({
        visiteId: foundVs.visiteId,
        ...emPartValues,
        examenMedicalId: foundVs.examId,
        examenMedicalPayee: hasPaid ? 'Y' : 'N',
      });
    }

    if (conValues.observation !== foundVs.visiteObservation) {
      setLoading(false);
      updateVisite({
        visiteId: foundVs.visiteId,
        visiteObservation: conValues.observation,
        modificateurRecent: cookies.UID,
      }).then(() => {
        setLoading(true);
      });
    }
    setShouldSave(false);
    document.getElementById('read-only-btn').click();
  };

  const hideModal = () => {
    setModalVisible(false);
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
                  onClick={() => hanldeUpdateVisite(foundVs.visiteId, 'doing')}
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
                      <Button
                        onClick={() => {
                          setEditable(true);
                          setShouldSave(true);
                        }}
                        icon={<EditOutlined />}
                      >
                        Mode Édition
                      </Button>
                    )}
                    {editable && (
                      <Button
                        onClick={() => {
                          setEditable(false);
                          onCommit();
                        }}
                        icon={<ReadOutlined />}
                        id="read-only-btn"
                      >
                        Mode Lecture seule
                      </Button>
                    )}
                    {shouldSave && (
                      <Button icon={<SaveOutlined />} onClick={onSave}>
                        Enregistrer
                      </Button>
                    )}
                  </div>
                  <VsPatientPeForm
                    foundVs={foundVs}
                    editable={editable}
                    ref={peFormRef}
                    version={peVersion}
                  />
                  <VsPatientEmForm foundVs={foundVs} editable={editable} ref={emFormRef} />
                  <VsPatientConForm
                    ref={conFormRef}
                    visiteObservation={foundVs.visiteObservation}
                    editable={editable}
                  />
                  {updateVisiteError && <div className="error btn-error">Mise à jour a échoué</div>}
                </div>
                <Button
                  type="primary"
                  size="large"
                  className="home-single-vs-dtl-page-content-btn slide-btn"
                  onClick={() => {
                    setModalVisible(true);
                  }}
                  loading={updateVisitePending && loading}
                >
                  Mettre fin à la surveillance
                </Button>
                <Modal
                  title="Mettre fin à la surveillance"
                  visible={modalVisible}
                  onOk={() => {
                    hideModal();
                    hanldeUpdateVisite(foundVs.visiteId, 'done');
                  }}
                  onCancel={hideModal}
                  okText="Confirmer"
                  cancelText="Annuler"
                >
                  Veuillez noter que confirmer que l'examen du patient a été complètement terminé et
                  que le paiement a été effectué.{' '}
                  <b>Toutes les informations ne peuvent pas être modifiées après la soumission.</b>
                </Modal>
              </div>
            )}
            {foundVs.visiteEtat === 2 && (
              <div className="visite-record">
                <VsPatientPeForm foundVs={foundVs} editable={false} />
                <VsPatientEmForm foundVs={foundVs} editable={false} />
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
