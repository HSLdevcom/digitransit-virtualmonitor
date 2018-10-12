import ApolloBoostClient, { gql, InMemoryCache, ApolloLink, HttpLink } from 'apollo-boost';
import { ApolloCache } from 'apollo-cache';
import { ApolloClient } from 'apollo-client';
import { createLoona, LoonaProvider, state, mutation, Context } from '@loona/react';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo'
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { IApolloClientContextType } from 'src/ApolloClientsContextCreator';
import App from 'src/App';
import i18n from 'src/i18n';
import 'src/index.css';
import registerServiceWorker from 'src/registerServiceWorker';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';
import { IConfiguration, IStop, IStopTimesView, IDisplay } from 'src/ui/ConfigurationList';
import schema, { OptionalId } from 'src/graphQL/schema';
import StopTimesView from 'src/ui/Views/StopTimesView';
import { ConfigurationFieldsFragment } from 'src/ui/ConfigurationRetriever';

const resolvers = {
  Mutation: {
    // addStop: (_: any, { configuration, display }: { configuration: string, display: string }, { cache, getCacheKey }: any) => {
    //   cache.writeData();
    //   return null;
    // },
    modifyLocalConfigurations: (_: any, { configuration }: { configuration: IConfiguration }, { cache, getCacheKey }: { cache: ApolloCache<any>, getCacheKey: any }) => {
      
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
(reittiOpasClient as any).name = 'reittiOpasClient';

const virtualMonitorCache = new InMemoryCache();

@state({
  defaults: {
    localConfigurations: [
/*       {
        id: uuidv4(),
        name: 'blah',
        position: null,
        displays: [
          {
            id: uuidv4(),
            name: 'Blah',
            position: null,
            viewCarousel: [
              {
                id: uuidv4(),
                displaySeconds: 10,
                view: {
                  id: uuidv4(),
                  type: 'stopTimes',
                  title: {
                    en: 'Arrr1',
                    fi: 'Arrr1',
                    __typename: 'TranslatedString'
                  },
                  stops: [
                    {
                      id: uuidv4(),
                      gtfsId: 'HSL:4700210',
                      overrideStopName: null,
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
        __typename: 'Configuration',
      }, */
    ],
  },
  typeDefs: [
    schema,
    gql`
      type Query {
        localConfigurations: [Configuration!]!
      }
    `
  ],
})
export class ViMoState {
  @mutation('addQuickConfiguration')
  addQuickConfiguration(_: any, context: Context) {
    const newConfiguration: any = {
      id: uuidv4(),
      name: 'QuickConfiguration',
      displays: [
        {
          id: uuidv4(),
          name: 'QuickDisplay',
          viewCarousel: [
            {
              id: uuidv4(),
              displaySeconds: 1,
              view: {
                id: uuidv4(),
                type: 'stopTimes',
                title: {
                  en: 'derp',
                  fi: 'derp',
                  __typename: 'TranslatedString',
                },
                stops: [],
              },
              __typename: 'SViewWithDisplaySeconds',
            },
          ],
          __typename: 'Display',
        },
      ],
      __typename: 'Configuration',
    };

    context.patchQuery(
      gql`
        ${ConfigurationFieldsFragment}
        {
          localConfigurations @client {
            ...configurationFields
          }
        }
      `,
      (data) => {
        data.localConfigurations.push(newConfiguration);
      }
    );
  }

  @mutation('removeStopFromStopTimesView')
  removeStopFromStopTimesView({ stopId }: { stopId: string }, context: Context) {
    context.patchQuery(
      gql`
        ${ConfigurationFieldsFragment}
        {
          localConfigurations @client {
            ...configurationFields
          }
        }
      `,
      (data) => {
        for (let conf of data.localConfigurations) {
          for (let display of conf.displays) {
            for (let viewCarouselElement of display.viewCarousel) {
              if (viewCarouselElement.view.stops.some((stop: IStop) => stop.id === stopId)) {
                viewCarouselElement.view.stops = viewCarouselElement.view.stops.filter((stop: IStop) => stop.id !== stopId);
              }
            }
          }
        }
      }
    );
    return;
  }

  @mutation('addStopToStopTimesView')
  addStopToStopTimesView({ stopTimesViewId, stop }: { stopTimesViewId: string, stop: OptionalId<IStop> }, context: Context) {
    const stopWithId = {
      id: uuidv4(), // Possibly overriden from stop.
      ...stop,
    };

    const StopTimesViewFragment = gql`
    fragment stopTimesViewFields on Node {
      ... on StopTimesView {
        id
        title {
          fi
          en
        }
        type
        stops {
          id
          gtfsId
          overrideStopName
        }
      }
    }
    `;
    
    context.patchQuery(
      gql`
        ${ConfigurationFieldsFragment}
        {
          localConfigurations @client {
            ...configurationFields
          }
        }
      `,
      (data) => {
        for (let conf of data.localConfigurations) {
          for (let display of conf.displays) {
            for (let viewCarouselElement of display.viewCarousel) {
              if (viewCarouselElement.view.id === stopTimesViewId) {
                viewCarouselElement.view.stops.push(stopWithId);
              }
            }
          }
        }
      }
    );
    return;

    const updated = context.cache.readQuery({
      query: gql`
        ${StopTimesViewFragment}
        {
          node(id: $stopTimesViewId) @client {
            ...stopTimesViewFields
          }
        }
      `,
      variables: {
        stopTimesViewId,
      },
    });

    context.patchQuery(
    // context.patchFragment(
      // StopTimesViewFragment,
      gql`
        ${StopTimesViewFragment}
        {
          node(id: "${stopTimesViewId}") @client {
            ...stopTimesViewFields
          }
        }
      `,
      (data) => {
        data.node
        data.node.stops.push(stopWithId)
        // return (data);
        // stopTimesView: IStopTimesView) => ({
        //   stops: 
        //     ...stopTimesView.stops,
        //     [stopWithId.id]: stopWithId
        //   }
        // })
      }
    );
  }
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
(virtualMonitorClient as any).name = 'VirtualMonitorClient';

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
