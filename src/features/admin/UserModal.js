import React, { useRef } from 'react';
// import PropTypes from 'prop-types';
import { Modal, Button, message } from 'antd';
import { UserDetailForm } from './';
import _ from 'lodash';
import { useAddUser, useUpdateUser } from './redux/hooks';
import { roles } from '../../common/constants';

export default function UserModal({ visible, onModalVisibleChange, data, handleVersionUpdate }) {
  const mode = _.isEmpty(data) ? 'new' : 'update';
  const userFormRef = useRef(null);
  const { addUser, addUserPending } = useAddUser();
  const { updateUser, updateUserPending } = useUpdateUser();

  const handleOk = e => {
    const newData = userFormRef.current && userFormRef.current.getFieldsValue();
    if (mode === 'new') {
      addUser({
        userNom: newData.username,
        userType: roles.indexOf(newData.role),
        userPassword: newData.password,
      })
        .then(() => {
          onModalVisibleChange(false);
          message.success('Créé avec succès', 5);
          handleVersionUpdate();
        })
        .catch(() => {
          onModalVisibleChange(false);
          message.error('Échec de la création', 5);
        });
    }
    if (mode === 'update') {
      updateUser({
        userId: newData.id,
        userNom: newData.username,
        userType: roles.indexOf(newData.role),
        userPassword: newData.password,
      })
        .then(() => {
          onModalVisibleChange(false);
          message.success('Mise à jour terminée', 5);
          handleVersionUpdate();
        })
        .catch(() => {
          onModalVisibleChange(false);
          message.error('Mise à jour a échoué', 5);
        });
    }
  };

  const handleCancel = e => {
    onModalVisibleChange(false);
  };

  return (
    <div className="admin-user-modal">
      <Modal
        title={_.isEmpty(data) ? 'Créer un nouvel utilisateur' : 'Modifier cet utilisateur'}
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
            disabled={addUserPending || updateUserPending}
          >
            {mode === 'new'
              ? addUserPending
                ? 'En cours..'
                : 'Créer'
              : updateUserPending
              ? 'En cours..'
              : 'Modifier'}
          </Button>,
        ]}
      >
        <UserDetailForm data={data} ref={userFormRef} />
      </Modal>
    </div>
  );
}

UserModal.propTypes = {};
UserModal.defaultProps = {};
