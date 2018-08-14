import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";

import {
  DaySeconds,
  EpochSecondsLocal,
  Seconds
} from "src/time";
import IncomingList from "src/ui/IncomingList";

const STOP_INCOMING_QUERY = gql`
query GetStops($stopIds: [String], $numberOfDepartures: Int!) {
  stops(ids: $stopIds) {
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
  readonly stops: ReadonlyArray<IStop>
}

export type StopId = string

interface IStopQuery {
  stopIds: ReadonlyArray<StopId>,
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
    variables={{ stopIds: props.stopIds, numberOfDepartures: props.displayedRoutes as number}}
    pollInterval={20000}
  >
    {(result: QueryResult<IStopResponse, IStopQuery>): React.ReactNode => {
      if (result.loading) {
        return (<div>{props.t('loading')}</div>);
      }
      if (!result || !result.data) {
        return (<div>
          {props.t('stopRetrieveError', { stopIds: props.stopIds })}
        </div>);
      }
      if (!result.data.stops || (result.data.stops.length <= 0)) {
        return (<div>
          {props.t('stopRetrieveNotFound', { stopIds: props.stopIds })}
        </div>);
      }

      // Merge the stoptimes.
      // const mergedStopTimes = result.data.stops.reduce(({}) => ({}), {});
      const mergedStopTimes = result.data.stops[0].stoptimesWithoutPatterns;

      return (
        <IncomingList
          stoptimesWithoutPatterns={mergedStopTimes}
        />
      );
    }}
  </StopIncomingQuery>
);

StopIncomingRetriever.defaultProps = {
  displayedRoutes: 12,
};

export default translate('translations')(StopIncomingRetriever);
