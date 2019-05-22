import { LoonaProvider } from '@loona/react';
import ApolloBoostClient, { InMemoryCache } from 'apollo-boost';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo'
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import { IApolloClientContextType } from 'src/ApolloClientsContextCreator';
import App from 'src/App';
import { loona, virtualMonitorClient } from 'src/graphQL/virtualMonitorClient';
import i18n from 'src/i18n';
import 'src/index.css';
import NtpSyncComponent from 'src/ntp/NtpSyncComponent';
import registerServiceWorker from 'src/registerServiceWorker';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';
import VirtualMonitorLocalState from 'src/VirtualMonitorLocalState';

const reittiOpasClient = new ApolloBoostClient({
  cache: new InMemoryCache(),
    // uri for hsl data
 // uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
   // uri for waltti cities data
   uri: 'https://api.digitransit.fi/routing/v1/routers/waltti/index/graphql',
});
(reittiOpasClient as any).name = 'reittiOpasClient';
export const contextValue: IApolloClientContextType = {
  default: reittiOpasClient,
  reittiOpas: reittiOpasClient,
  virtualMonitor: virtualMonitorClient,
};

ReactDOM.render(
  (
    <NtpSyncComponent>
      <ApolloClientsContext.Provider value={contextValue}>
        <ApolloClientsContext.Consumer>
          {(apolloClientContexts) => (
            <ApolloProvider client={apolloClientContexts.virtualMonitor}>
              <LoonaProvider loona={loona} states={[VirtualMonitorLocalState]}>
                <I18nextProvider i18n={i18n}>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </I18nextProvider>
              </LoonaProvider>
            </ApolloProvider>
          )}
        </ApolloClientsContext.Consumer>
      </ApolloClientsContext.Provider>
    </NtpSyncComponent>
  ),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
