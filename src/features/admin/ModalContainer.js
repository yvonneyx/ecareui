import React, { useRef } from 'react';
// import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { UserDetailForm, ExamenDetailForm, DptDetailForm, CoorDetailForm } from './';
import _ from 'lodash';
import {
  useAddUser,
  useUpdateUser,
  useAddExamen,
  useUpdateExamen,
  useAddDpt,
  useUpdateDpt,
} from './redux/hooks';

export default function ModalContainer(props) {
  const { name, visible, onModalVisibleChange, data } = props;
  const mode = _.isEmpty(data) ? 'new' : 'update';
  const userFormRef = useRef(null);
  const examenFormRef = useRef(null);
  const dptFormRef = useRef(null);
  const coorFormRef = useRef(null);
  const { addUserPending } = useAddUser();
  const { updateUserPending } = useUpdateUser();
  const { addExamenPending } = useAddExamen();
  const { updateExamenPending } = useUpdateExamen();
  const { addDptPending } = useAddDpt();
  const { updateDptPending } = useUpdateDpt();

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
        ? 'Ajouter un nouvel examen medical'
        : 'Modifier cet examen medical'
      : name === 'coordinateur'
      ? _.isEmpty(data)
        ? 'Ajouter un nouvel coordinateur'
        : 'Modifier cet coordinateur'
      : _.isEmpty(data)
      ? 'Ajouter un nouvel département médical'
      : 'Modifier cet département médical';

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
              updateDptPending
            }
          >
            {mode === 'new'
              ? addUserPending || addExamenPending || addDptPending
                ? 'En cours..'
                : 'Créer'
              : updateUserPending || updateExamenPending || addDptPending
              ? 'En cours..'
              : 'Modifier'}
          </Button>,
        ]}
      >
        {name === 'user' && <UserDetailForm data={data} ref={userFormRef} {...props} />}
        {name === 'examen' && <ExamenDetailForm data={data} ref={examenFormRef} {...props} />}
        {name === 'dpt' && <DptDetailForm data={data} ref={dptFormRef} {...props} />}
        {name === 'coordinateur' && <CoorDetailForm data={data} ref={coorFormRef} {...props} />}
      </Modal>
    </div>
  );
}

ModalContainer.propTypes = {};
ModalContainer.defaultProps = {};
