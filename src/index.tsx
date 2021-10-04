import { LoonaProvider } from '@loona/react';
import ApolloBoostClient, { InMemoryCache } from 'apollo-boost';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import { IApolloClientContextType } from './ApolloClientsContextCreator';
import App from './App';
import { loona, virtualMonitorClient } from './graphQL/virtualMonitorClient';
import i18n from './i18n';
import { default as config } from './monitorConfig.js';
import NtpSyncComponent from './ntp/NtpSyncComponent';
import registerServiceWorker from './registerServiceWorker';
import { ApolloClientsContext } from './VirtualMonitorApolloClients';
import VirtualMonitorLocalState from './VirtualMonitorLocalState';
import { getParams } from './util/queryUtils';
import { getConfig } from './util/getConfig';

const domain = window.location.hostname;
const monitorConfig = getConfig();

const reittiOpasClient = new ApolloBoostClient({
  cache: new InMemoryCache(),
  // GraphQL API endpoint
  uri: monitorConfig.uri,
});
(reittiOpasClient as any).name = 'reittiOpasClient';
export const contextValue: IApolloClientContextType = {
  default: reittiOpasClient,
  reittiOpas: reittiOpasClient,
  virtualMonitor: virtualMonitorClient,
};

ReactDOM.render(
  <NtpSyncComponent>
    <ApolloClientsContext.Provider value={contextValue}>
      <ApolloClientsContext.Consumer>
        {(apolloClientContexts: any) => (
          <ApolloProvider client={apolloClientContexts.virtualMonitor}>
            <LoonaProvider loona={loona} states={[VirtualMonitorLocalState]}>
              <I18nextProvider i18n={i18n}>
                <BrowserRouter>
                  <App
                    monitorConfig={monitorConfig}
                    search={getParams(window.location.search)}
                  />
                </BrowserRouter>
              </I18nextProvider>
            </LoonaProvider>
          </ApolloProvider>
        )}
      </ApolloClientsContext.Consumer>
    </ApolloClientsContext.Provider>
  </NtpSyncComponent>,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
