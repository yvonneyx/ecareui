import React, { useRef } from 'react';
// import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { UserDetailForm, ExamenDetailForm } from './';
import _ from 'lodash';
import { useAddUser, useUpdateUser, useAddExamen, useUpdateExamen } from './redux/hooks';

export default function ModalContainer(props) {
  const { name, visible, onModalVisibleChange, data } = props;
  const mode = _.isEmpty(data) ? 'new' : 'update';
  const userFormRef = useRef(null);
  const examenFormRef = useRef(null);
  const { addUserPending } = useAddUser();
  const { updateUserPending } = useUpdateUser();
  const { addExamenPending } = useAddExamen();
  const { updateExamenPending } = useUpdateExamen();

  const handleOk = e => {
    if (name === 'user') {
      userFormRef.current && userFormRef.current.onFinish();
    }
    if (name === 'examen') {
      examenFormRef.current && examenFormRef.current.onFinish();
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
      : _.isEmpty(data)
      ? 'Ajouter un nouvel examen medical'
      : 'Modifier cet examen medical';

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
              addUserPending || updateUserPending || addExamenPending || updateExamenPending
            }
          >
            {mode === 'new'
              ? addUserPending || addExamenPending
                ? 'En cours..'
                : 'Créer'
              : updateUserPending || updateExamenPending
              ? 'En cours..'
              : 'Modifier'}
          </Button>,
        ]}
      >
        {name === 'user' && <UserDetailForm data={data} ref={userFormRef} {...props} />}
        {name === 'examen' && <ExamenDetailForm data={data} ref={examenFormRef} {...props} />}
      </Modal>
    </div>
  );
}

ModalContainer.propTypes = {};
ModalContainer.defaultProps = {};
