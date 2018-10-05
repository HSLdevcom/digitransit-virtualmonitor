import ApolloBoostClient, { gql, InMemoryCache, ApolloLink, HttpLink } from 'apollo-boost';
import { ApolloCache } from 'apollo-cache';
import { ApolloClient } from 'apollo-client';
import { createLoona, LoonaProvider, state } from '@loona/react';
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
import { IConfiguration } from 'src/ui/ConfigurationList';
import schema from 'src/graphQL/schema';

const resolvers = {
  Mutation: {
    // addStop: (_: any, { configuration, display }: { configuration: string, display: string }, { cache, getCacheKey }: any) => {
    //   cache.writeData();
    //   return null;
    // },
    modifyLocalConfigurations: (_: any, { name }: { name: string }, { cache, getCacheKey }: { cache: ApolloCache<any>, getCacheKey: any }) => {

    },
    createLocalConfiguration: (_: any, { name }: { name: string }, { cache, getCacheKey }: { cache: ApolloCache<any>, getCacheKey: any }) => {
      return null;
    },
    createDisplay: (_: any, { configurationName, name }: { configurationName: string, name: string }, { cache, getCacheKey }: { cache: ApolloCache<any>, getCacheKey: any }) => {
      return null;
    },
  }
};

const reittiOpasClient = new ApolloBoostClient({
  cache: new InMemoryCache(),
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
});

const virtualMonitorCache = new InMemoryCache();

@state({
  defaults: {
    derp: 10,
    localConfigurations: [
      {
        name: 'blah',
        displays: [
          {
            name: 'Blah',
            viewCarousel: [
              {
                displaySeconds: 10,
                view: {
                  type: 'stopTimes',
                  title: {
                    fi: 'Arrr1',
                    __typename: 'TranslatedString'
                  },
                  stops: [
                    {
                      gtfsId: 'HSL:4700210',
                      __typename: 'Stop',
                    },
                  ],
                  __typename: 'StopTimesView',
                },
                __typename: 'SViewWithDisplaySeconds',
              },
            ],
            __typename: 'Display',
          },
        ],
      __typename: 'LocalConfiguration',
      },
    ],
  },
  typeDefs: [
    schema,
    gql`
      type Query {
        localConfigurations: [Configuration!]!
      }
    `
  ]
})
export class ViMoState {
};

const loona = createLoona(virtualMonitorCache);

const virtualMonitorClient = new ApolloClient({
  cache: virtualMonitorCache,
  link: ApolloLink.from([
    loona,
    new HttpLink({
      uri: 'http://localhost:4000',
    })
  ]),
});

export const contextValue: IApolloClientContextType = {
  default: reittiOpasClient,
  reittiOpas: reittiOpasClient,
  virtualMonitor: virtualMonitorClient,
};

ReactDOM.render(
  (<ApolloClientsContext.Provider value={contextValue}>
    <ApolloClientsContext.Consumer>
      {(apolloClientContexts) => (
        <ApolloProvider client={apolloClientContexts.default}>
          <LoonaProvider loona={loona} states={[ViMoState]}>
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
