import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";

import {
  DaySeconds,
  EpochSecondsLocal,
  Seconds
} from "src/time";
import StopIncomingList from "src/ui/StopIncomingList";

const STOP_INCOMING_QUERY = gql`
query GetStop($stopId: String!, $numberOfDepartures: Int!) {
  stop(id: $stopId) {
    name,
    gtfsId,
    stoptimesWithoutPatterns(numberOfDepartures: $numberOfDepartures) {
      scheduledArrival
      realtimeArrival
      arrivalDelay
      scheduledDeparture
      realtimeDeparture
      departureDelay
      timepoint
      realtime
      realtimeState
      pickupType
      dropoffType
      serviceDay
      stopHeadsign
      headsign,
      trip {
        gtfsId,
        route {
          shortName,
        },
      },
    },
  }
}
`;

export interface IStopTime {
  scheduledArrival: DaySeconds,
  realtimeArrival: DaySeconds,
  arrivalDelay: Seconds,
  scheduledDeparture: DaySeconds,
  realtimeDeparture: DaySeconds,
  departureDelay: Seconds,
  timepoint: boolean,
  realtime: boolean,
  realtimeState: "SCHEDULED" | "UPDATED" | "CANCELED" | "ADDED" | "MODIFIED",
  pickupType: "SCHEDULED" | "NONE" | "CALL_AGENCY" | "COORDINATE_WITH_DRIVER",
  dropoffType: "SCHEDULED" | "NONE" | "CALL_AGENCY" | "COORDINATE_WITH_DRIVER",
  serviceDay: EpochSecondsLocal,
  stopHeadsign: string,
  headsign: string,
  trip: {
    gtfsId: number,
    route: {
      shortName: string,
    },
  },
};

export interface IStop {
  name: string,
  gtfsId: string,
  stoptimesWithoutPatterns: IStopTime[]
};

interface IStopResponse {
  stop: IStop
}

export type StopId = string

interface IStopQuery {
  stopId: StopId,
  numberOfDepartures: number,
};

class StopIncomingQuery extends Query<IStopResponse, IStopQuery> {}

export interface IStopIncomingRetrieverProps {
  stopIds: StopId[],
  displayedRoutes?: number,
};

const StopIncomingRetriever: React.StatelessComponent<IStopIncomingRetrieverProps> = (props: IStopIncomingRetrieverProps & InjectedTranslateProps) => (
  <StopIncomingQuery
    query={STOP_INCOMING_QUERY}
    variables={{ stopId: props.stopIds[0], numberOfDepartures: props.displayedRoutes as number}}
    pollInterval={20000}
  >
    {(result: QueryResult<IStopResponse, IStopQuery>): React.ReactNode => {
      if (result.loading) {
        return (<div>{props.t('loading')}</div>);
      }
      if (!result || !result.data) {
        return (<div>
          {props.t('stopRetrieveError', { stopId: props.stopIds[0] })}
        </div>);
      }
      if (result.data.stop === null) {
        return (<div>
          {props.t('stopRetrieveNotFound', { stopId: props.stopIds[0] })}
        </div>);
      }

      return (
        <StopIncomingList
          stop={result.data.stop}
        />
      );
    }}
  </StopIncomingQuery>
);

StopIncomingRetriever.defaultProps = {
  displayedRoutes: 12,
};

export default translate('translations')(StopIncomingRetriever);
