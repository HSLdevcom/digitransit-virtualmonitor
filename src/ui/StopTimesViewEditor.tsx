import gql from "graphql-tag";
import * as React from "react";
import { Mutation, QueryResult } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";
import { Link } from "react-router-dom";

import { IStopWithName as StopsByNameRetrieverIStop } from "src/ui/StopsByNameRetriever";
import { IConfiguration, IStopTimesView, IStop } from "src/ui/ConfigurationList";
import { ApolloClientsContext } from "src/VirtualMonitorApolloClients";
import StopInfoRetriver, { IStopInfoResponse } from 'src/ui/StopInfoRetriever';
import StopSearch from 'src/ui/StopSearch';

type IViewEditorProps = {
  readonly configuration?: IConfiguration,
  readonly view: IStopTimesView,
} & InjectedTranslateProps;

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

const StopTimesViewEditor = ({configuration, view, t}: IViewEditorProps) => (
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
        { view.stops.length > 0
          ? (<StopInfoRetriver
            stops={view.stops.map(stop => stop.gtfsId)}
          >
            {(result: QueryResult<IStopInfoResponse>): React.ReactNode => {
              return (
                <>
                  {result.loading
                    ? <div>{t('loadingInfo')}</div>
                    : null}
                  {result.error
                    ? <div>{t('error')} {result.error.message}</div>
                    : null}
                  <ul>
                    {view.stops.map(s => {
                      const stopInfo = (!result.loading && !result.error)
                        ? result.data!.stopInfos.find(stopInfo => stopInfo.gtfsId === s.gtfsId)
                        : undefined;
                      const removeStopButton = (
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
                      );
  
                      if (!result.loading && !result.error && !stopInfo) {
                        return (
                            <li key={s.gtfsId}>
                              Pysäkkiä Id:llä {s.gtfsId} ei löytynyt.
                              &nbsp;
                              {removeStopButton}
                            </li>
                          );
                        }
  
                      return (
                        <li key={s.gtfsId}>
                          <Link
                            to={`/stop/${s.gtfsId}`}
                          >
                            {stopInfo
                              ? (<span>{stopInfo.name} (pysäkkinumero {stopInfo.code || ''})</span>)
                              : (<span>{s.gtfsId}</span>)
                            }
                          </Link>
                          {removeStopButton}
                        </li>
                      );
                    })}
                  </ul>
                </>
              );
            }}
          </StopInfoRetriver>)
          : null
        }
        <Mutation
          mutation={ADD_STOP}
          client={virtualMonitor}
        >
          {(addStopToStopTimesView) => (
            <StopSearch>
              {(stops: ReadonlyArray<StopsByNameRetrieverIStop>) => (
                <ul>
                  {stops.map((stop) => (
                    <li key={stop.gtfsId}>
                      <Link
                        to={`/stop/${stop.gtfsId}`}
                      >
                      {stop.name} - {stop.gtfsId}
                      </Link>
                      <button onClick={() => addStopToStopTimesView({
                        variables: {
                          stopTimesViewId: view.id,
                          stop: {
                            gtfsId: stop.gtfsId,
                            overrideStopName: null,
                            __typename: 'Stop',
                          },
                        },
                      })}>
                        {t('prepareStop')}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </StopSearch>
          )}
        </Mutation>
      </div>
    )}
  </ApolloClientsContext.Consumer>
);

export default translate('translations')(StopTimesViewEditor);
