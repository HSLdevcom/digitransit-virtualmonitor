import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import NtpSyncComponent from './ntp/NtpSyncComponent';
import { getParams } from './util/queryUtils';
import { getConfig } from './util/getConfig';
import { ConfigContext } from './contexts';
import './i18n';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <NtpSyncComponent>
    <BrowserRouter>
      <ConfigContext.Provider value={getConfig()}>
        <App search={getParams(window.location.search)} />
      </ConfigContext.Provider>
    </BrowserRouter>
  </NtpSyncComponent>,
);
