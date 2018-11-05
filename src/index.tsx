import { LoonaProvider } from '@loona/react';
import ApolloBoostClient, { InMemoryCache } from 'apollo-boost';
import { ApolloCache } from 'apollo-cache';
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
import registerServiceWorker from 'src/registerServiceWorker';
import { IConfiguration } from 'src/ui/ConfigurationList';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';
import VirtualMonitorLocalState from 'src/VirtualMonitorLocalState';

// const resolvers = {
//   Mutation: {
//     // addStop: (_: any, { configuration, display }: { configuration: string, display: string }, { cache, getCacheKey }: any) => {
//     //   cache.writeData();
//     //   return null;
//     // },
//     createDisplay: (_: any, { configurationName, name }: { configurationName: string, name: string }, { cache, getCacheKey }: { cache: ApolloCache<any>, getCacheKey: any }) => {
//       return null;
//     },
//     createLocalConfiguration: (_: any, { name }: { name: string }, { cache, getCacheKey }: { cache: ApolloCache<any>, getCacheKey: any }) => {
//       return null;
//     },
//     modifyLocalConfigurations: (_: any, { configuration }: { configuration: IConfiguration }, { cache, getCacheKey }: { cache: ApolloCache<any>, getCacheKey: any }) => {
      
//     },
//   }
// };

const reittiOpasClient = new ApolloBoostClient({
  cache: new InMemoryCache(),
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
});
(reittiOpasClient as any).name = 'reittiOpasClient';

export const contextValue: IApolloClientContextType = {
  default: reittiOpasClient,
  reittiOpas: reittiOpasClient,
  virtualMonitor: virtualMonitorClient,
};

ReactDOM.render(
  (<ApolloClientsContext.Provider value={contextValue}>
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
  </ApolloClientsContext.Provider>),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
