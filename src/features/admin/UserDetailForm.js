import React, { useImperativeHandle, forwardRef } from 'react';
// import PropTypes from 'prop-types';
import { roles } from '../../common/constants';
import { Form, Input, Select } from 'antd';
import _ from 'lodash';

function UserDetailForm(props, ref) {
  const { data } = props;
  const [form] = Form.useForm();
  const mode = _.isEmpty(data) ? 'new' : 'update';

  useImperativeHandle(
    ref,
    () => ({
      getFieldsValue: () => {
        return form.getFieldsValue();
      },
    }),
    [form],
  );

  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
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
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
              return <Select.Option value={role} key={role}>{role}</Select.Option>;
            })}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserDetailForm = forwardRef(UserDetailForm);

UserDetailForm.propTypes = {};
UserDetailForm.defaultProps = {};
