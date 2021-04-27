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
import {default as config} from 'src/monitorConfig.js';
import NtpSyncComponent from 'src/ntp/NtpSyncComponent';
import registerServiceWorker from 'src/registerServiceWorker';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';
import VirtualMonitorLocalState from 'src/VirtualMonitorLocalState';

const domain = window.location.hostname;
let monitorConfig: { feedId?: string; uri: any; };

if(domain.indexOf('tremonitori') >= 0) {
  // domain url for Tampere Virtual monitor
  monitorConfig = config.tampere;
} else if(domain.indexOf('matkamonitori') >= 0) {
  // domain url for Matka.fi Virtual monitor
  monitorConfig = config.matka;
} else if(domain.indexOf('jyvaskyla') >= 0) {
  // domain url for Linkki Virtual monitor
  monitorConfig = config.linkki;
} else {
  monitorConfig = config.matka;
}

const getParams = (query: string) => {
  if (!query) {
    return {};
  }

  return query
    .substring(1)
    .split('&')
    .map(v => v.split('='))
    .reduce((params, [key, value]) => {
      const newParam = {};
      newParam[key] = decodeURIComponent(value);
      return { ...params, ...newParam };
    }, {});
};

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
  (
    <NtpSyncComponent>
      <ApolloClientsContext.Provider value={contextValue}>
        <ApolloClientsContext.Consumer>
          {(apolloClientContexts) => (
            <ApolloProvider client={apolloClientContexts.virtualMonitor}>
              <LoonaProvider loona={loona} states={[VirtualMonitorLocalState]}>
                <I18nextProvider i18n={i18n}>
                  <BrowserRouter>
                    <App monitorConfig={monitorConfig} search={getParams(window.location.search)}/>
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
