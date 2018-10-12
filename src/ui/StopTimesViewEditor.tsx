import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";
import { Link } from "react-router-dom";

import { IStop as StopsByNameRetrieverIStop } from "src/ui/StopsByNameRetriever";
import { IConfiguration, IStopTimesView, IStop } from "src/ui/ConfigurationList";
import { ApolloClientsContext } from "src/VirtualMonitorApolloClients";
import UnroutedStopSelector from 'src/ui/UnroutedStopSelector';

interface IViewEditorProps {
  readonly configuration?: IConfiguration,
  readonly view: IStopTimesView,
};

const ADD_STOP = gql`
  mutation AddStopToStopTimesView($stopTimesViewId: ID!, $stop: Stop!) {
    addStopToStopTimesView(stopTimesViewId: $stopTimesViewId, stop: $stop) @client
  }
`;

const REMOVE_STOP = gql`
  mutation RemoveStopFromStopTimesView($stopId: ID!) {
    removeStopFromStopTimesView(stopId: $stopId) @client
  }
`;

// {
//   Mutation: {
//     addStop: (_: any, { configuration, display }: { configuration: string, display: string }, { cache, getCacheKey }: any) => {
//       cache.writeData();
//     },
//   },
// };

// const wrapper: MouseEvent<HTMLButtonElement> = () => {

// };

const StopTimesViewEditor = ({configuration, view, t}: IViewEditorProps & InjectedTranslateProps) => (
  <ApolloClientsContext.Consumer>
    {({ virtualMonitor }) => (
      <div>
        <h2>
          {configuration
            ? (<Link to={`/configuration/${configuration.name}/view/${view.title}`}>
              {`${t('display')} :`}
              {view.title && (Object.values(view.title).length > 0)
                ? Object.values(view.title).filter(title => title)[0] || view.title
                : view.title
              }
            </Link>)
            : `${view.title ? view.title.fi : 'Tuntematon näkymä.'}`
          }
        </h2>
        <ul>
          {Object.values(view.stops).map(s => (
            <div key={s.gtfsId}>
              <Link
                to={`/stop/${s.gtfsId}`}
              >
                Stop ({s.id}) {s.gtfsId}
              </Link>
              <Mutation
                mutation={REMOVE_STOP}
                client={virtualMonitor}
              >
                {(removeStopFromStopTimesView) => (
                  <button onClick={() => removeStopFromStopTimesView({
                    variables: {
                      stopId: s.id,
                    },
                  })}>
                    {t('removeStop')}
                  </button>
                )}
              </Mutation>
            </div>
          ))}
        </ul>
        <Mutation
          mutation={ADD_STOP}
          client={virtualMonitor}
        >
            {(addStopToStopTimesView) => (
              <>
                <UnroutedStopSelector stopRenderer={(stop: StopsByNameRetrieverIStop) => (
                  <>
                    <span>{stop.name}</span>
                    <button onClick={() => addStopToStopTimesView({
                      variables: {
                        stopTimesViewId: view.id,
                        stop: {
                          gtfsId: stop.gtfsId,
                          __typename: 'Stop',
                        },
                      },
                    })}>
                      {t('prepareStop')}
                    </button>
                  </>
                )} />
                <button onClick={() => addStopToStopTimesView({
                  variables: {
                    stopTimesViewId: view.id,
                    stop: {
                      gtfsId: 'HSL:4700212',
                      __typename: 'Stop',
                    },
                  },
                })}>
                {t('prepareStop')}
              </button>
            </>
          )}
        </Mutation>
      </div>
    )}
  </ApolloClientsContext.Consumer>
);

export default translate('translations')(StopTimesViewEditor);
