import React from 'react';
// import PropTypes from 'prop-types';
import { Menu } from 'antd';
import {
  UserOutlined,
  MedicineBoxOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  SolutionOutlined,
  UserSwitchOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import UserSimpleProfile from '../home/UserSimpleProfile';

const { SubMenu } = Menu;

export default function SidePanel(props) {
  const [openKeys, setOpenKeys] = React.useState(['sub1']);
  let pathname = window.location.pathname;
  const rootSubmenuKeys = ['sub1'];

  if (pathname === '/coordinateur') {
    pathname = '/coordinateur/gestion-des-utilisateurs';
  }

  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <div className="coordinateur-side-panel">
      <div className="coordinateur-side-panel-logo" />
      <UserSimpleProfile />
      <Menu mode="inline" selectedKeys={[pathname]} openKeys={openKeys} onOpenChange={onOpenChange}>
        <Menu.Item key="/coordinateur/gestion-des-patients" icon={<UserOutlined />}>
          <Link to="/coordinateur/gestion-des-patients">Gestion des patients</Link>
        </Menu.Item>
        <Menu.Item key="/coordinateur/gestion-des-visites" icon={<SolutionOutlined />}>
          <Link to="/coordinateur/gestion-des-visites">Gestion des visites</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

SidePanel.propTypes = {};
SidePanel.defaultProps = {};
