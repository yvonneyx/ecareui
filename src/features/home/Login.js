import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import {} from './redux/hooks';
import {} from 'antd';
import { Form, Input, Button, Radio } from 'antd';

export default function Login() {
  const [role, setRole] = useState('nurse');

  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="home-login">
      <div className="home-login-banner">1</div>
      <div className="home-login-body">
        <div className="home-login-body-header">
          e-Care
        </div>
          <div className="home-login-body-form">
            <div className="home-login-body-form-title">Se connecter</div>
            <div className="home-login-body-form-subtitle">Pour accéder à votre compte</div>
            <Form
              name="basic"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item name="role">
                <Radio.Group defaultValue="nurse">
                  <Radio.Button value="nurse">Connexion infirmière</Radio.Button>
                  <Radio.Button value="admin">Connexion administrateur</Radio.Button>
                  <Radio.Button value="coordinator">Connexion du coordinateur</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="Username" name="username">
                <Input />
              </Form.Item>

              <Form.Item label="Mot de passe:" name="password">
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Me connecter
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
    </div>
  );
}

Login.propTypes = {};
Login.defaultProps = {};
