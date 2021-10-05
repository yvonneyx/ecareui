import React, { useImperativeHandle, forwardRef } from 'react';
// import PropTypes from 'prop-types';
import { roles } from '../../common/constants';
import { Form, Input, Select, message, notification } from 'antd';
import _ from 'lodash';
import { useAddUser, useUpdateUser } from './redux/hooks';

var UserDetailForm = function(props, ref) {
  const { data, onModalVisibleChange, handleVersionUpdate } = props;
  const [form] = Form.useForm();
  const mode = _.isEmpty(data) ? 'new' : 'update';
  const { addUser } = useAddUser();
  const { updateUser } = useUpdateUser();

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      const values = form.getFieldsValue();
      form
        .validateFields()
        .then(() => {
          return onFinish(values);
        })
        .catch(() => {
          notification.error({
            message: 'Error',
            description: 'Veuillez remplir si nécessaire.',
          });
        });
    },
  }));

  const onFinish = values => {
    if (mode === 'new') {
      addUser({
        userNom: values.username,
        userType: roles.indexOf(values.role),
        userPassword: values.password,
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
        userId: values.id,
        userNom: values.username,
        userType: roles.indexOf(values.role),
        userPassword: values.password,
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

  const initialValues = {
    id: data.userId,
    username: data.userNom,
    password: data.userPassword,
    role: roles[data.userType],
  };

  return (
    <div className="admin-user-detail-form">
      <Form
        name="user-detail-form"
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={initialValues}
      >
        {mode === 'update' && (
          <Form.Item label="ID" name="id">
            <span className="ant-form-text">{data.userId}</span>
          </Form.Item>
        )}

        <Form.Item
          label="Nom d'utilisateur"
          name="username"
          rules={[
            {
              required: true,
              message: "Veuillez saisir le nom d'utilisateur!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[
            {
              required: true,
              message: "Veuillez créer un mot de passe d'initialisation pour cela.",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="role"
          label="Rôle"
          rules={[
            {
              required: true,
              message: "Définir le rôle de l'utilisateur.",
            },
          ]}
        >
          <Select>
            {roles.slice(0, 3).map(role => {
              return (
                <Select.Option value={role} key={role}>
                  {role}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserDetailForm = forwardRef(UserDetailForm);

UserDetailForm.propTypes = {};
UserDetailForm.defaultProps = {};
