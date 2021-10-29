import React from 'react';
// import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { UserOutlined, SolutionOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import UserSimpleProfile from '../home/UserSimpleProfile';
import { useCookies } from 'react-cookie';

export default function SidePanel(props) {
  const [, , removeCookie] = useCookies(['UID', 'UNAME', 'UROLE']);
  const [openKeys, setOpenKeys] = React.useState(['sub1']);
  let pathname = window.location.pathname;
  const rootSubmenuKeys = ['sub1'];

  if (pathname === '/coordinateur') {
    pathname = '/coordinateur/gestion-des-utilisateurs';
  }

  const removeCookies = () => {
    removeCookie('UID', { path: '/' });
    removeCookie('UNAME', { path: '/' });
    removeCookie('UROLE', { path: '/' });
  };

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
      <div className="coordinateur-side-panel-logo"><img src={require('../../images/logo1.png')} /></div>
      <UserSimpleProfile />
      <Menu mode="inline" selectedKeys={[pathname]} openKeys={openKeys} onOpenChange={onOpenChange}>
        <Menu.Item key="/coordinateur/nouvelle-visite" icon={<UserOutlined />}>
          <Link to="/coordinateur/nouvelle-visite">Nouvelle visite</Link>
        </Menu.Item>
        <Menu.Item key="/coordinateur/nouvelle-ordonnance" icon={<UserOutlined />}>
          <Link to="/coordinateur/nouvelle-ordonnance">Nouvelle ordonnance</Link>
        </Menu.Item>
        <Menu.Item key="/coordinateur/gestion-des-ordonnances" icon={<UserOutlined />}>
          <Link to="/coordinateur/gestion-des-ordonnances">Gestion des ordonnances</Link>
        </Menu.Item>
        <Menu.Item key="/coordinateur/gestion-des-visites" icon={<SolutionOutlined />}>
          <Link to="/coordinateur/gestion-des-visites">Gestion des visites</Link>
        </Menu.Item>
        <Menu.Item key="/coordinateur/gestion-des-patients" icon={<UserOutlined />}>
          <Link to="/coordinateur/gestion-des-patients">Gestion des patients</Link>
        </Menu.Item>
      </Menu>
      <a className="logout" onClick={removeCookies}>
        Se déconnecter
      </a>
    </div>
  );
}

SidePanel.propTypes = {};
SidePanel.defaultProps = {};
