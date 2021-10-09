import React, { useRef } from 'react';
// import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import {
  UserDetailForm,
  ExamenDetailForm,
  DptDetailForm,
  CoorDetailForm,
  InfirDetailForm,
  PatientDetailForm,
} from './';
import _ from 'lodash';
import {
  useAddUser,
  useUpdateUser,
  useAddExamen,
  useUpdateExamen,
  useAddDpt,
  useUpdateDpt,
  useAddPatient,
  useUpdatePatient,
  useUpdateCoor,
  useUpdateInfirmiere,
} from './redux/hooks';

export default function ModalContainer(props) {
  const { name, visible, onModalVisibleChange, data } = props;
  const mode = _.isEmpty(data) ? 'new' : 'update';
  const userFormRef = useRef(null);
  const examenFormRef = useRef(null);
  const dptFormRef = useRef(null);
  const coorFormRef = useRef(null);
  const infirmFormRef = useRef(null);
  const patientFormRef = useRef(null);
  const { addUserPending } = useAddUser();
  const { updateUserPending } = useUpdateUser();
  const { addExamenPending } = useAddExamen();
  const { updateExamenPending } = useUpdateExamen();
  const { addDptPending } = useAddDpt();
  const { updateDptPending } = useUpdateDpt();
  const { addPatientPending } = useAddPatient();
  const { updatePatientPending } = useUpdatePatient();
  const { updateCoorPending } = useUpdateCoor();
  const { updateInfirmierePending } = useUpdateInfirmiere();

  const handleOk = e => {
    switch (name) {
      case 'user':
        userFormRef.current && userFormRef.current.onFinish();
        break;
      case 'examen':
        examenFormRef.current && examenFormRef.current.onFinish();
        break;
      case 'dpt':
        dptFormRef.current && dptFormRef.current.onFinish();
        break;
      case 'coordinateur':
        coorFormRef.current && coorFormRef.current.onFinish();
      case 'infirmiere':
        infirmFormRef.current && infirmFormRef.current.onFinish();
      case 'patient':
        patientFormRef.current && patientFormRef.current.onFinish();
      default:
        break;
    }
  };

  const handleCancel = e => {
    onModalVisibleChange(false);
  };

  const titleToShow =
    name === 'user'
      ? _.isEmpty(data)
        ? 'Créer un nouvel utilisateur'
        : 'Modifier cet utilisateur'
      : name === 'examen'
      ? _.isEmpty(data)
        ? 'Ajouter un nouvel examen médical'
        : 'Modifier cet examen médical'
      : name === 'coordinateur'
      ? 'Modifier ce coordinateur'
      : name === 'infirmiere'
      ? 'Modifier cet infirmiere'
      : name === 'patient'
      ? _.isEmpty(data)
        ? 'Ajouter un nouveau patient'
        : 'Modifier ce patient'
      : _.isEmpty(data)
      ? 'Ajouter un nouveau département médical'
      : 'Modifier ce département médical';

  return (
    <div className="admin-modal">
      <Modal
        title={titleToShow}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} className="modal-btn">
            Annuler
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            className="modal-btn"
            disabled={
              addUserPending ||
              updateUserPending ||
              addExamenPending ||
              updateExamenPending ||
              addDptPending ||
              updateDptPending ||
              addPatientPending ||
              updatePatientPending ||
              updateCoorPending ||
              updateInfirmierePending
            }
          >
            {mode === 'new'
              ? addUserPending || addExamenPending || addDptPending || addPatientPending
                ? 'En cours..'
                : 'Créer'
              : updateUserPending ||
                updateExamenPending ||
                updateDptPending ||
                updatePatientPending ||
                updateCoorPending ||
                updateInfirmierePending
              ? 'En cours..'
              : 'Modifier'}
          </Button>,
        ]}
      >
        <div className="modal-tip-obligatoire">* Champs obligatoires</div>
        {name === 'user' && <UserDetailForm data={data} ref={userFormRef} {...props} />}
        {name === 'examen' && <ExamenDetailForm data={data} ref={examenFormRef} {...props} />}
        {name === 'dpt' && <DptDetailForm data={data} ref={dptFormRef} {...props} />}
        {name === 'coordinateur' && <CoorDetailForm data={data} ref={coorFormRef} {...props} />}
        {name === 'infirmiere' && <InfirDetailForm data={data} ref={infirmFormRef} {...props} />}
        {name === 'patient' && <PatientDetailForm data={data} ref={patientFormRef} {...props} />}
      </Modal>
    </div>
  );
}

ModalContainer.propTypes = {};
ModalContainer.defaultProps = {};
