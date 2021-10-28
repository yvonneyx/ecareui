/* This is the Root component mainly initializes Redux and React Router. */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { hot, setConfig } from 'react-hot-loader';
import store from './common/store';
import routeConfig from './common/routeConfig';
import history from './common/history';
import useForceUpdate from 'use-force-update';
import { useCookies } from 'react-cookie';
import _ from 'lodash';

setConfig({
  logLevel: 'debug',
});

function renderRouteConfigV3(routes, contextPath, cookies) {
  // Resolve route config object in React Router v3.
  const children = []; // children component list

  const renderRoute = (item, routeContextPath) => {
    let roles = ['admin', 'infirmiere', 'coordinateur'];
    let role = !_.isEmpty(cookies) && roles[cookies.UROLE];

    let newContextPath;
    if (/^\//.test(item.path)) {
      newContextPath = item.path;
    } else {
      newContextPath = `${routeContextPath}/${item.path}`;
    }
    newContextPath = newContextPath.replace(/\/+/g, '/');

    if (item.component && item.childRoutes) {
      const childRoutes = renderRouteConfigV3(item.childRoutes, newContextPath, cookies);
      children.push(
        <Route
          key={newContextPath}
          render={props => <item.component {...props}>{childRoutes}</item.component>}
          path={newContextPath}
        />,
      );
    } else if (item.component) {
      children.push(
        <Route key={newContextPath} component={item.component} path={newContextPath} exact />,
      );
    } else if (item.childRoutes) {
      item.childRoutes.forEach(r => renderRoute(r, newContextPath));
    }

    if (_.isEmpty(cookies) && item.protected) {
      item = {
        ...item,
        component: () => <Redirect to="/login" />,
        children: [],
      };
    } else if (item.protected && item.path !== role) {
      item = {
        ...item,
        component: () => <Redirect to="/common/403" />,
        children: [],
      };
    }
  };

  routes.forEach(item => renderRoute(item, contextPath));

  // Use Switch so that only the first matched route is rendered.
  return <Switch>{children}</Switch>;
}

function Root() {
  const [cookies, setCookie] = useCookies(['UID', 'UNAME', 'UROLE']);
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    store.subscribe(() => {
      forceUpdate();
    }, []);
  });

  const children = renderRouteConfigV3(routeConfig, '/', cookies);

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>{children}</ConnectedRouter>
    </Provider>
  );
}

export default hot(module)(Root);
