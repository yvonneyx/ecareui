import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import Root from './Root';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import './styles/index.less';

ReactDOM.render(
  <CookiesProvider>
    <Root />
  </CookiesProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
