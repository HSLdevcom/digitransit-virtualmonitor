import gql from "graphql-tag";
import * as React from "react";
import { Mutation, QueryResult } from "react-apollo";
import { WithTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { virtualMonitorClient } from 'src/graphQL/virtualMonitorClient';
import { IConfiguration, IStopTimesView } from "src/ui/ConfigurationList";
import StopEditor from 'src/ui/StopEditor';
import StopInfoRetriver, { IStopInfoResponse } from 'src/ui/StopInfoRetriever';
import { IStopWithName as StopsByNameRetrieverIStop } from "src/ui/StopsByNameRetriever";
import StopSearch from 'src/ui/StopSearch';
import { ApolloClientsContext } from "src/VirtualMonitorApolloClients";

type IViewEditorProps = {
  readonly configuration?: IConfiguration,
  readonly view: IStopTimesView,
} & WithTranslation;

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

const MOVE_STOP = gql`
  mutation MoveStop($stopTimesViewId: ID!, $stopId: ID!, $direction: String!) {
    moveStop(stopTimesViewId: $stopTimesViewId, stopId: $stopId, direction: $direction) @client
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
            : `${view.title ? view.title.fi : t('viewErrorNoTitle')}`
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
                        ? result.data!.stopInfos.find(findStopInfo => findStopInfo.gtfsId === s.gtfsId)
                        : undefined;
                      const removeStopButton = (
                        <Mutation
                          mutation={REMOVE_STOP}
                          client={virtualMonitor}
                        >
                          {(removeStopFromStopTimesView: (arg0: { variables: { stopId: string | undefined; }; }) => void) => (
                            <button onClick={() => removeStopFromStopTimesView({
                              variables: {
                                stopId: s.id,
                              },
                            })}>
                              {t('viewEditorRemoveStop')}
                            </button>
                          )}
                        </Mutation>
                      );

                      const moveStopButtons = (
                        <Mutation
                          mutation={MOVE_STOP}
                          client={virtualMonitorClient}
                        >
                          {(moveStop: (arg0: { variables: { direction: string; stopId: string | undefined; stopTimesViewId: string | undefined; } | { direction: string; stopId: string | undefined; stopTimesViewId: string | undefined; }; }) => void) => (
                            <>
                              <button
                                onClick={() => moveStop({
                                  variables: {
                                    direction: 'up',
                                    stopId: s.id,
                                    stopTimesViewId: view.id,
                                  }
                                })}
                              >
                                {t('viewEditorMoveStopUp')}
                              </button>
                              <button
                                onClick={() => moveStop({
                                  variables: {
                                    direction: 'down',
                                    stopId: s.id,
                                    stopTimesViewId: view.id,
                                  }
                                })}
                              >
                                {t('viewEditorMoveStopDown')}
                              </button>
                            </>
                        )}
                        </Mutation>
                      );

                      if (!result.loading && !result.error && !stopInfo) {
                        return (
                            <li key={s.gtfsId}>
                              {t('viewEditorErrorStopNotFound', { stopId: s.gtfsId })}
                              &nbsp;
                              {moveStopButtons}
                              {removeStopButton}
                            </li>
                          );
                        }

                      return (
                        <li key={s.gtfsId}>
                          <StopEditor
                            stop={s}
                            stopInfo={stopInfo}
                          />
                            {moveStopButtons}
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
          {(addStopToStopTimesView: (arg0: { variables: { stop: { __typename: string; gtfsId: string; overrideStopName: null; }; stopTimesViewId: string | undefined; }; }) => void) => (
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
                          stop: {
                            __typename: 'Stop',
                            gtfsId: stop.gtfsId,
                            overrideStopName: null,
                          },
                          stopTimesViewId: view.id,
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

export default withTranslation('translations')(StopTimesViewEditor);
