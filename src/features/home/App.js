import React from 'react';
import { ConfigProvider } from 'antd';
import frFR from 'antd/lib/locale/fr_FR';

export default function App({ children }) {
  return (
    <div className="home-app">
      <ConfigProvider locale={frFR}>
        <div className="page-container">{children}</div>
      </ConfigProvider>
    </div>
  );
}
