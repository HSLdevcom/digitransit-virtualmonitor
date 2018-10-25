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
import { IConfiguration, IStop, IDisplay, IViewCarouselElement } from 'src/ui/ConfigurationList';
import schema, { OptionalId } from 'src/graphQL/schema';
import { ConfigurationFieldsFragment, DisplayFieldsFragment } from 'src/ui/ConfigurationRetriever';
import { virtualMonitorClient, loona } from 'src/graphQL/virtualMonitorClient';

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

@state({
  defaults: {
    localConfigurations: [
    ],
  },
  typeDefs: [
    schema,
    gql`
      # input SViewInput {
      #   id!
      #     type: String!
      #     ...on StopTimesView {
      #       title {
      #         fi: String!
      #       }!!
      #     }
      # }

      input SViewCarouselInput {
        id: ID!
        displaySeconds: Float!
        # view: SViewInput!
      }

      input SDisplayInput {
        id: ID!
        name: String!
        viewCarousel: [SViewCarouselInput!]!
      }

      type Query {
        localConfigurations: [Configuration!]!
        node(id: ID): Node
      }
    `
  ],
})
export class ViMoState {
  // @resolve('Query.node')
  // node(_: any, { id }: { id: string }, context: Context) {
  //   return context.getCacheKey({ __typename: 'Node', id });
  //   // debugger;
  // }

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
              displaySeconds: 3,
              view: {
                id: uuidv4(),
                type: 'stopTimes',
                title: {
                  en: '',
                  fi: '',
                  __typename: 'TranslatedString',
                },
                stops: [],
                __typename: 'StopTimesView', // This doesn't seem to work for some reason.
              },
              __typename: 'SViewWithDisplaySeconds',
            },
          ],
          position: null,
          __typename: 'Display',
        },
      ],
      position: null,
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

    return newConfiguration;
  }

  @mutation('addQuickDisplay')
  addQuickDisplay({ display }: { display: IDisplay }, context: Context) {

    const nullifiedDisplay: any = {
      ...display,
      position: display.position || null,
    }

    const newConfiguration: any = {
      id: uuidv4(),
      name: 'QuickConfiguration',
      displays: [ nullifiedDisplay ],
      position: null,
      __typename: 'Configuration',
    };

    context.patchQuery(
      gql`
        ${DisplayFieldsFragment}
        {
          localConfigurations @client {
            ...displayFields
          }
        }
      `,
      (data) => {
        data.localConfigurations.push(newConfiguration);
      }
    );

    return display;
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
    return stopWithId;

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

  @mutation('addViewCarouselElement')
  addViewCarouselElement({ displayId, viewCarouselElement }: { displayId: string, viewCarouselElement: OptionalId<IViewCarouselElement> }, context: Context) {
    const defaultViewCarouselElement = {
      displaySeconds: 2,
      view: {
        title: {
          fi: '',
          en: '',
          __typename: 'TranslatedString',
        },
        type: 'stopTimes',
        stops: [],
        __typename: 'StopTimesView',
      },
      __typename: 'ViewWithDisplaySeconds',
    };

    const viewCarouselElementToAdd: IViewCarouselElement = {
      id: uuidv4(),
      ...(viewCarouselElement || defaultViewCarouselElement),
      view: {
        id: uuidv4(),
        ...(viewCarouselElement || defaultViewCarouselElement).view,
        __typename: 'StopTimesView',
      },
      __typename: 'ViewWithDisplaySeconds',
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
        for (let conf of (data.localConfigurations as ReadonlyArray<IConfiguration>)) {
          for (let display of conf.displays) {
            if (display.id === displayId) {
              (display.viewCarousel as Array<IViewCarouselElement>).push(viewCarouselElementToAdd)
            }
          }
        }
      }
    );
    return viewCarouselElementToAdd;
  }

  @mutation('setViewCarouselElementDisplaySeconds')
  setViewCarouselElementDisplaySeconds({ viewCarouselElementId, displaySeconds }: { viewCarouselElementId: string, displaySeconds: number }, context: Context) {
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
        for (let conf of (data.localConfigurations as ReadonlyArray<IConfiguration>)) {
          for (let display of conf.displays) {
            for (let viewCarouselElement of display.viewCarousel) {
              if (viewCarouselElement.id === viewCarouselElementId) {
                (viewCarouselElement.displaySeconds as number) = displaySeconds;
              }
            }
          }
        }
      }
    );
  }
};

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
