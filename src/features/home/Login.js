import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Form, Input, Button, notification } from 'antd';
import { useLogin } from './redux/hooks';
import _ from 'lodash';

export default function Login(props) {
  const [cookies, setCookie] = useCookies(['UID', 'UCID', 'UIID', 'UNAME', 'UROLE']);
  const [radioValue, setRadioValue] = useState(1);
  const { login, loginPending, loginError } = useLogin();
  const [form] = Form.useForm();

  const onFinish = values => {
    login({
      userNom: values.username,
      userPassword: values.password,
      userType: radioValue,
    }).then(res => {
      if (!_.isEmpty(res.data.ext)) {
        let loggedUser = res.data.ext.user;
        let role = loggedUser.userType;
        let jumpTo = role === 0 ? '/admin' : role === 1 ? '/infirmiere' : '/coordinateur';
        setCookie('UID', loggedUser.userId, { path: '/' });
        setCookie('UNAME', loggedUser.userNom, { path: '/' });
        setCookie('UROLE', role, { path: '/' });
        if (role === 1) {
          setCookie('UIID', loggedUser.infirmiereId, { path: '/' });
        } else if (role === 2) {
          debugger;
          setCookie('UCID', loggedUser.coordinateurId, { path: '/' });
        }

        props.history.push(jumpTo);
      } else {
        notification['error']({
          message: 'Échec de la connexion.',
          description:
            "Veuillez vérifier que votre identité, nom d'utilisateur et mot de passe sont corrects.",
        });
      }
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const onRadioBtnChange = e => {
    let id = e.currentTarget.id;
    let ind = id === 'admin' ? 0 : id === 'nurse' ? 1 : 2;
    setRadioValue(ind);
  };

  return (
    <div className="home-login">
      <div className="home-login-container">
        <div className="left-panel">
          <div className="content">Le soin, le plus simple</div>
          <img src={require('../../images/undraw_medicine.svg')} className="image" alt="" />
        </div>
        <div className="right-panel">
          <div className="logo">
            <img src={require('../../images/logo1.png')} />
            <span>E-Care</span>
          </div>

          <div className="login-form">
            <div className="login-form-title">Se connecter</div>
            <div className="login-form-subtitle">Pour accéder à votre compte</div>
            <Form
              form={form}
              name="basic"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <div className="login-form-radio-btns">
                <Button
                  onClick={e => onRadioBtnChange(e)}
                  id="nurse"
                  className={radioValue === 1 && 'login-form-radio-btn-checked'}
                >
                  Infirmière
                </Button>
                <Button
                  onClick={e => onRadioBtnChange(e)}
                  id="admin"
                  className={radioValue === 0 && 'login-form-radio-btn-checked'}
                >
                  Administrateur
                </Button>
                <Button
                  onClick={e => onRadioBtnChange(e)}
                  id="coor"
                  className={radioValue === 2 && 'login-form-radio-btn-checked'}
                >
                  Coordinateur
                </Button>
              </div>

              <Form.Item label="Nom d'utilisateur" name="username">
                <Input />
              </Form.Item>

              <Form.Item label="Mot de passe" name="password">
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Me connecter
                </Button>
              </Form.Item>
              {loginError &&
                notification['error']({
                  message: 'Échec de la connexion.',
                  description:
                    "Veuillez vérifier que votre identité, nom d'utilisateur et mot de passe sont corrects.",
                })}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {};
Login.defaultProps = {};
