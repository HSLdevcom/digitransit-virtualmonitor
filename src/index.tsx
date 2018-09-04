import ApolloBoostClient, { InMemoryCache } from 'apollo-boost';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo'
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import { IApolloClientContextType } from 'src/ApolloClientsContextCreator';
import App from 'src/App';
import i18n from 'src/i18n';
import 'src/index.css';
import registerServiceWorker from 'src/registerServiceWorker';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';

const apolloCache = new InMemoryCache();

const resolvers = {
  Mutation: {
    addStop: (_: any, { configuration, display }: { configuration: string, display: string }, { cache, getCacheKey }: any) => {
      cache.writeData();
      return null;
    },
  }
};

const reittiOpasClient = new ApolloBoostClient({
  cache: apolloCache,
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
});

const virtualMonitorClient = new ApolloBoostClient({
  cache: new InMemoryCache(),
  clientState: {
    defaults: {},
    resolvers,
  },
  uri: 'http://localhost:4000',
});

export const contextValue: IApolloClientContextType = {
  // default: reittiOpasClient,
  default: virtualMonitorClient,
  reittiOpas: reittiOpasClient,
  virtualMonitor: virtualMonitorClient,
};

ReactDOM.render(
  (<ApolloClientsContext.Provider value={contextValue}>
    <ApolloClientsContext.Consumer>
      {(apolloClientContexts) => (
        <ApolloProvider client={apolloClientContexts.default}>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </I18nextProvider>
        </ApolloProvider>
      )}
    </ApolloClientsContext.Consumer>
  </ApolloClientsContext.Provider>),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
