import { Context, mutation, state } from '@loona/react';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';

import schema, { OptionalId } from 'src/graphQL/schema';
import { IConfiguration, IDisplay, IStop, IStopTimesView, IViewCarouselElement } from 'src/ui/ConfigurationList';
import { ConfigurationFieldsFragment, DisplayFieldsFragment } from 'src/ui/ConfigurationRetriever';

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
export class VirtualMonitorLocalState {
  // @resolve('Query.node')
  // node(_: any, { id }: { id: string }, context: Context) {
  //   return context.getCacheKey({ __typename: 'Node', id });
  //   // debugger;
  // }

  @mutation('addQuickConfiguration')
  public addQuickConfiguration(_: any, context: Context) {
    const newConfiguration: any = {
      __typename: 'Configuration',
      displays: [
        {
          __typename: 'Display',
          id: uuidv4(),
          name: 'QuickDisplay',
          position: null,
          viewCarousel: [
            {
              __typename: 'SViewWithDisplaySeconds',
              displaySeconds: 3,
              id: uuidv4(),
              view: {
                __typename: 'StopTimesView', // This doesn't seem to work for some reason.
                id: uuidv4(),
                stops: [],
                title: {
                  __typename: 'TranslatedString',
                  en: '',
                  fi: '',
                },
                type: 'stopTimes',
              },
            },
          ],
        },
      ],
      id: uuidv4(),
      name: 'QuickConfiguration',
      position: null,
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
  public addQuickDisplay({ display }: { display: IDisplay }, context: Context) {

    const nullifiedDisplay: any = {
      ...display,
      position: display.position || null,
    }

    const newConfiguration: any = {
      __typename: 'Configuration',
      displays: [ nullifiedDisplay ],
      id: uuidv4(),
      name: 'QuickConfiguration',
      position: null,
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

    return display;
  }

  @mutation('removeStopFromStopTimesView')
  public removeStopFromStopTimesView({ stopId }: { stopId: string }, context: Context) {
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
        for (const conf of data.localConfigurations) {
          for (const display of conf.displays) {
            for (const viewCarouselElement of display.viewCarousel) {
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
  public addStopToStopTimesView({ stopTimesViewId, stop }: { stopTimesViewId: string, stop: OptionalId<IStop> }, context: Context) {
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
        for (const conf of data.localConfigurations) {
          for (const display of conf.displays) {
            for (const viewCarouselElement of display.viewCarousel) {
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
  public addViewCarouselElement({ displayId, viewCarouselElement }: { displayId: string, viewCarouselElement: OptionalId<IViewCarouselElement> }, context: Context) {
    const defaultViewCarouselElement = {
      __typename: 'ViewWithDisplaySeconds',
      displaySeconds: 2,
      view: {
        __typename: 'StopTimesView',
        stops: [],
        title: {
          __typename: 'TranslatedString',
          en: '',
          fi: '',
        },
        type: 'stopTimes',
      },
    };

    const viewCarouselElementToAdd: IViewCarouselElement = {
      __typename: 'ViewWithDisplaySeconds',
      id: uuidv4(),
      ...(viewCarouselElement || defaultViewCarouselElement),
      view: {
        __typename: 'StopTimesView',
        id: uuidv4(),
        ...(viewCarouselElement || defaultViewCarouselElement).view,
      },
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
        for (const conf of (data.localConfigurations as ReadonlyArray<IConfiguration>)) {
          for (const display of conf.displays) {
            if (display.id === displayId) {
              (display.viewCarousel as IViewCarouselElement[]).push(viewCarouselElementToAdd)
            }
          }
        }
      }
    );
    return viewCarouselElementToAdd;
  }

  @mutation('setOverrideStopName')
  public setOverrideStopName({ stopId, overrideStopName }: { stopId: string, overrideStopName: string | null }, context: Context) {
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
        for (const conf of (data.localConfigurations as ReadonlyArray<IConfiguration>)) {
          for (const display of conf.displays) {
            for (const viewCarouselElement of display.viewCarousel) {
              if (viewCarouselElement.view.type === 'stopTimes') {
                for (const stop of (viewCarouselElement.view as IStopTimesView).stops) {
                  if (stop.id === stopId) {
                    (stop.overrideStopName as string | undefined) = overrideStopName ? overrideStopName : undefined;
                  }
                }
              }
            }
          }
        }
      }
    );
  }

  @mutation('setViewCarouselElementDisplaySeconds')
  public setViewCarouselElementDisplaySeconds({ viewCarouselElementId, displaySeconds }: { viewCarouselElementId: string, displaySeconds: number }, context: Context) {
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
        for (const conf of (data.localConfigurations as ReadonlyArray<IConfiguration>)) {
          for (const display of conf.displays) {
            for (const viewCarouselElement of display.viewCarousel) {
              if (viewCarouselElement.id === viewCarouselElementId) {
                (viewCarouselElement.displaySeconds as number) = displaySeconds;
              }
            }
          }
        }
      }
    );
  }

  @mutation('setViewTitle')
  public setViewTitle({ viewId, title }: { viewId: string, title: string }, context: Context) {
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
        for (const conf of (data.localConfigurations as ReadonlyArray<IConfiguration>)) {
          for (const display of conf.displays) {
            for (const viewCarouselElement of display.viewCarousel) {
              if ((viewCarouselElement.view.id === viewId) && viewCarouselElement.view.title) {
                (viewCarouselElement.view.title.fi as string) = title;
              }
            }
          }
        }
      }
    );
  }

  @mutation('removeViewCarouselElement')
  public removeViewCarouselElement({ displayId, viewCarouselElementId }: { displayId: string, viewCarouselElementId: string }, context: Context) {
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
        for (const conf of (data.localConfigurations as ReadonlyArray<IConfiguration>)) {
          for (const display of conf.displays) {
            if ((display.id === displayId) && (display.viewCarousel.find(vce => vce.id === viewCarouselElementId))) {
              (display.viewCarousel as IViewCarouselElement[]) = display.viewCarousel.filter(vce => vce.id !== viewCarouselElementId)
            }
          }
        }
      }
    );
  }
};

export default VirtualMonitorLocalState;
