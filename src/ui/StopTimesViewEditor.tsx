import gql from "graphql-tag";
import * as React from "react";
import { Mutation, QueryResult } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";
import { Link } from "react-router-dom";

import { IStop as StopsByNameRetrieverIStop } from "src/ui/StopsByNameRetriever";
import { IConfiguration, IStopTimesView, IStop } from "src/ui/ConfigurationList";
import { ApolloClientsContext } from "src/VirtualMonitorApolloClients";
import UnroutedStopSelector from 'src/ui/UnroutedStopSelector';
import StopInfoRetriver, { IStopInfoResponse } from 'src/ui/StopInfoRetriever';

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
        <StopInfoRetriver
          stops={Object.values(view.stops).map(stop => stop.gtfsId)}
        >
          {(result: QueryResult<IStopInfoResponse>): React.ReactNode => {
            if (result.loading || result.error) {
              return (
                <>
                  {result.loading
                    ? <div>{t('loadingInfo')}</div>
                    : null}
                  {result.error
                    ? <div>{t('error')} {result.error.message}</div>
                    : null}
                  <ul>
                    {Object.values(view.stops).map(s => (
                      <li key={s.gtfsId}>
                        <Link
                          to={`/stop/${s.gtfsId}`}
                        >
                          {/* {s.name} pysäkkinumero {s.code || ''} */}
                          {s.gtfsId}
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
                      </li>
                    ))}
                  </ul>
                </>
              );
            }
            return (
              <>
                <ul>
                  {Object.values(view.stops).map(s => {
                    const stopInfo = result.data!.stopInfos.find(stopInfo => stopInfo.gtfsId === s.gtfsId)
                    if (!stopInfo) {
                      return (
                        <li key={s.gtfsId}>
                          Pysäkkiä Id:llä {s.gtfsId} ei löytynyt.
                        </li>
                      );
                    }
                    return (
                      <li key={s.gtfsId}>
                        <Link
                          to={`/stop/${s.gtfsId}`}
                        >
                          {stopInfo.name} (pysäkkinumero {stopInfo.code || ''})
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
                      </li>
                    );
                  })}
                </ul>
              </>
            );
          }}
        </StopInfoRetriver>
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
