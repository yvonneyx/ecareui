import React, { useState, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
// import PropTypes from 'prop-types';
import { roles } from '../../common/constants';
import { Form, Input, Select, message, notification } from 'antd';
import _ from 'lodash';
import { useAddUser, useUpdateUser, useGetDptsList } from './redux/hooks';

var UserDetailForm = function(props, ref) {
  const { data, onModalVisibleChange, handleVersionUpdate } = props;
  const [selectedRole, setSelectedRole] = useState('');
  const [form] = Form.useForm();
  const mode = _.isEmpty(data) ? 'new' : 'update';
  const { addUser } = useAddUser();
  const { updateUser } = useUpdateUser();
  const { dptsList, getDptsList, getDptsListPending } = useGetDptsList();

  useEffect(() => {
    if (selectedRole === 'Infirmière' && _.isEmpty(dptsList)) {
      getDptsList();
    }
  }, [getDptsList, selectedRole, dptsList]);

  const dptsOption = useMemo(() => {
    return (dptsList || []).map(dpt => {
      return {
        value: dpt.departementId,
        name: dpt.departementNom,
      };
    });
  }, [dptsList]);

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

  const processPromise = p =>
    p
      .then(() => {
        onModalVisibleChange(false);
        message.success('Créé avec succès', 5);
        handleVersionUpdate();
      })
      .catch(() => {
        onModalVisibleChange(false);
        message.error('Échec de la création', 5);
      });

  const onFinish = values => {
    if (mode === 'new') {
      if (selectedRole === 'Administrateur') {
        processPromise(
          addUser({
            userNom: values.username,
            userType: 0,
            userPassword: values.password,
          }),
        );
      } else if (selectedRole === 'Infirmière') {
        processPromise(
          addUser({
            userNom: values.username,
            userType: 1,
            userPassword: values.password,
            infirmiereNom: values.infirmiereNom,
            infirmiereTelephone: values.infirmiereTelephone,
            departementId: values.departementId,
          }),
        );
      } else {
        processPromise(
          addUser({
            userNom: values.username,
            userPassword: values.password,
            userType: 2,
            coordinateurNom: values.coordinateurNom,
            coordinateurTelephone: values.coordinateurTelephone,
          }),
        );
      }
    }
    if (mode === 'update') {
      updateUser({
        userId: values.id,
        userNom: values.username,
        userType: roles.indexOf(values.role),
        userPassword: values.new_password || values.password,
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
          span: 9,
        }}
        wrapperCol={{
          span: 15,
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

        {mode === 'new' && (
          <Form.Item
            label="Mot de passe"
            name="password"
            extra="Votre mot de passe doit être composé de 6 à 20 chiffres, lettres ou traits de soulignement, dont au moins deux, commençant par une lettre."
            rules={[
              {
                required: true,
                pattern: /^[a-zA-Z](?![a-zA-Z]+$)\w{5,19}$/,
                message: 'Veuillez vérifier le mot de passe',
              },
            ]}
          >
            <Input />
          </Form.Item>
        )}

        {mode === 'update' && (
          <Form.Item
            label="Nouveau mot de passe"
            name="new_password"
            extra="Votre mot de passe doit être composé de 6 à 20 chiffres, lettres ou traits de soulignement, dont au moins deux, commençant par une lettre."
            rules={[
              {
                required: true,
                pattern: /^[a-zA-Z](?![a-zA-Z]+$)\w{5,19}$/,
                message: 'Veuillez vérifier le mot de passe',
              },
            ]}
          >
            <Input />
          </Form.Item>
        )}

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
          <Select onSelect={value => setSelectedRole(value)}>
            {roles.slice(0, 3).map(role => {
              return (
                <Select.Option value={role} key={role}>
                  {role}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        {mode === 'new' && selectedRole === 'Infirmière' && (
          <>
            <Form.Item
              label="Nom et prénom"
              name="infirmiereNom"
              rules={[
                {
                  required: true,
                  message: 'Veuillez saisir le nom et prénom',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Téléphone"
              name="infirmiereTelephone"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const regex = new RegExp('^[0-9]{1,10}$');
                    if (!value || regex.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Veuillez saisir un numéro de téléphone exact'),
                    );
                  },
                }),
              ]}
            >
              <Input addonBefore={<span>+33</span>} />
            </Form.Item>

            <Form.Item label="Département concerné" name="departementId">
              {!getDptsListPending ? (
                <Select
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {dptsOption.map(dpt => {
                    return (
                      <Select.Option value={dpt.value} key={dpt.value}>
                        {dpt.name}
                      </Select.Option>
                    );
                  })}
                  }
                </Select>
              ) : (
                <span className="ant-form-text">Échec du chargement</span>
              )}
            </Form.Item>
          </>
        )}

        {mode === 'new' && selectedRole === 'Coordinateur' && (
          <>
            <Form.Item
              label="Nom et prénom"
              name="coordinateurNom"
              rules={[
                {
                  required: true,
                  message: 'Veuillez saisir le nom et prénom',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Téléphone"
              name="coordinateurTelephone"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const regex = new RegExp('^[0-9]{0,10}$');
                    if (!value || regex.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Veuillez saisir un numéro de téléphone exact'),
                    );
                  },
                }),
              ]}
            >
              <Input addonBefore={<span>+33</span>} />
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

export default UserDetailForm = forwardRef(UserDetailForm);

UserDetailForm.propTypes = {};
UserDetailForm.defaultProps = {};
