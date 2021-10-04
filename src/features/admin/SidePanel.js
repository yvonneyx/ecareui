import React from 'react';
// import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { UserOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import UserSimpleProfile from '../home/UserSimpleProfile';

const { SubMenu } = Menu;

export default function SidePanel() {
  const handleClick = e => {
    console.log('click ', e);
  };

  return (
    <div className="admin-side-panel">
      <img className="admin-side-panel-logo" src={require('../../images/logo.png')} />
      <UserSimpleProfile />
      <Menu onClick={handleClick} defaultSelectedKeys={['users']} mode="inline">
        <Menu.Item key="users" icon={<UserOutlined />}>
          <Link to="/admin/gestion-des-utilisateurs">Gestion des utilisateurs</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

SidePanel.propTypes = {};
SidePanel.defaultProps = {};
