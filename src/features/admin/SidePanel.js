import React from 'react';
// import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { UserOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import UserSimpleProfile from '../home/UserSimpleProfile';

export default function SidePanel(props) {
  let pathname = window.location.pathname;

  if (pathname === '/admin') {
    pathname = '/admin/gestion-des-utilisateurs';
  }

  return (
    <div className="admin-side-panel">
      <img className="admin-side-panel-logo" src={require('../../images/logo.png')} />
      <UserSimpleProfile />
      <Menu mode="inline" selectedKeys={[pathname]}>
        <Menu.Item key="/admin/gestion-des-utilisateurs" icon={<UserOutlined />}>
          <Link to="/admin/gestion-des-utilisateurs">Gestion des utilisateurs</Link>
        </Menu.Item>
        <Menu.Item key="/admin/gestion-des-examens" icon={<MedicineBoxOutlined />}>
          <Link to="/admin/gestion-des-examens">Gestion des examens</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

SidePanel.propTypes = {};
SidePanel.defaultProps = {};
