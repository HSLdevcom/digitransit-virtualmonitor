import React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import NtpSyncComponent from './ntp/NtpSyncComponent';
import { getParams } from './util/queryUtils';
import { getConfig } from './util/getConfig';
import './i18n'

const monitorConfig = getConfig();

ReactDOM.render(
  <NtpSyncComponent>
    <BrowserRouter>
      <App
        monitorConfig={monitorConfig}
        search={getParams(window.location.search)}
      />
      </BrowserRouter>
  </NtpSyncComponent>,
  document.getElementById('root') as HTMLElement,
);
