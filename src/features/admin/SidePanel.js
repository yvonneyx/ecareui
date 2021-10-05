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

  if (pathname === '/admin') {
    pathname = '/admin/gestion-des-utilisateurs';
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
    <div className="admin-side-panel">
      <div className="admin-side-panel-logo" />
      <UserSimpleProfile />
      <Menu mode="inline" selectedKeys={[pathname]} openKeys={openKeys} onOpenChange={onOpenChange}>
        <SubMenu key="sub1" title="Gestion du personnel" icon={<TeamOutlined />}>
          <Menu.Item key="/admin/gestion-des-utilisateurs" icon={<IdcardOutlined />}>
            <Link to="/admin/gestion-des-utilisateurs">Utilisateurs</Link>
          </Menu.Item>
          <Menu.Item key="/admin/gestion-des-coordinateurs" icon={<UserSwitchOutlined />}>
            <Link to="/admin/gestion-des-coordinateurs">Coordinateurs</Link>
          </Menu.Item>
          <Menu.Item key="/admin/gestion-des-infirmieres" icon={<UserOutlined />}>
            <Link to="/admin/gestion-des-infirmieres">Infirmières</Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item key="/admin/gestion-des-examens" icon={<MedicineBoxOutlined />}>
          <Link to="/admin/gestion-des-examens">Gestion des examens</Link>
        </Menu.Item>
        <Menu.Item key="/admin/gestion-des-departements" icon={<AppstoreAddOutlined />}>
          <Link to="/admin/gestion-des-departements">Gestion des départements</Link>
        </Menu.Item>
        <Menu.Item key="/admin/gestion-des-patients" icon={<UserOutlined />}>
          <Link to="/admin/gestion-des-patients">Gestion des patients</Link>
        </Menu.Item>
        <Menu.Item key="/admin/gestion-des-visites" icon={<SolutionOutlined />}>
          <Link to="/admin/gestion-des-visites">Gestion des visites</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

SidePanel.propTypes = {};
SidePanel.defaultProps = {};
