import React from 'react';
// import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { UserOutlined, SolutionOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import UserSimpleProfile from '../home/UserSimpleProfile';

const { SubMenu } = Menu;

export default function SidePanel(props) {
  const [openKeys, setOpenKeys] = React.useState(['sub1']);
  let pathname = window.location.pathname;
  const rootSubmenuKeys = ['sub1'];

  if (pathname === '/infirmiere') {
    pathname = '/infirmiere/visite-summary';
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
    <div className="infirmiere-side-panel">
      <div className="infirmiere-side-panel-logo"><img src={require('../../images/logo1.png')} /></div>
      <UserSimpleProfile />
      <Menu mode="inline" selectedKeys={[pathname]} openKeys={openKeys} onOpenChange={onOpenChange}>
        <Menu.Item key="/infirmiere/visite-summary" icon={<UserOutlined />}>
          <Link to="/infirmiere/visite-summary">Visites liée à moi</Link>
        </Menu.Item>
        <Menu.Item key="/infirmiere/gestion-des-ordonnances" icon={<UserOutlined />}>
          <Link to="/infirmiere/gestion-des-ordonnances">Ordonnances liée à moi</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

SidePanel.propTypes = {};
SidePanel.defaultProps = {};
