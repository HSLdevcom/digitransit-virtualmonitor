import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import i18n from './i18n';
import NtpSyncComponent from './ntp/NtpSyncComponent';
import { getParams } from './util/queryUtils';
import { getConfig } from './util/getConfig';

const monitorConfig = getConfig();

ReactDOM.render(
  <NtpSyncComponent>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <App
          monitorConfig={monitorConfig}
          search={getParams(window.location.search)}
        />
      </BrowserRouter>
    </I18nextProvider>
  </NtpSyncComponent>,
  document.getElementById('root') as HTMLElement,
);
