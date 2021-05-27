import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryProps, QueryResult } from "react-apollo";

import {
  DaySeconds,
  EpochSecondsLocal,
  Seconds
} from "../time";
import { ApolloClientsContext } from '../VirtualMonitorApolloClients';

const usedStopTimeField = 'realtimeDeparture';

const STOP_TIMES_QUERY = gql`
query GetStops($stopIds: [String], $numberOfDepartures: Int!) {
  stops(ids: $stopIds) {
    name,
    gtfsId,
    stoptimesWithoutPatterns(numberOfDepartures: $numberOfDepartures) {
      stop {
        id
        gtfsId
        platformCode
      }
      scheduledArrival
      realtimeArrival
      arrivalDelay
      scheduledDeparture
      realtimeDeparture
      departureDelay
      usedTime: ${usedStopTimeField}
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
        stops {
          id
        },
        route {
          shortName,
        },
      },
    },
  }
}
`;
export interface ITripStops {
  readonly id: string,
}
export interface IStopTime {
  readonly stop?: {
    readonly gtfsId: string,
    readonly overrideStopName?: string, // Added locally from configuration.
    readonly platformCode?: string,
    readonly id: string,
  },
  // readonly scheduledArrival: DaySeconds,
  // readonly realtimeArrival: DaySeconds,
  // readonly arrivalDelay: Seconds,
  // readonly scheduledDeparture: DaySeconds,
  // readonly realtimeDeparture: DaySeconds,
  // readonly departureDelay: Seconds,
  readonly usedTime: DaySeconds,
  readonly timepoint: boolean,
  readonly realtime: boolean,
  readonly realtimeState: "SCHEDULED" | "UPDATED" | "CANCELED" | "ADDED" | "MODIFIED",
  readonly pickupType: "SCHEDULED" | "NONE" | "CALL_AGENCY" | "COORDINATE_WITH_DRIVER",
  readonly dropoffType: "SCHEDULED" | "NONE" | "CALL_AGENCY" | "COORDINATE_WITH_DRIVER",
  readonly serviceDay: EpochSecondsLocal,
  readonly stopHeadsign: string,
  readonly headsign: string,
  readonly trip: {
    readonly gtfsId: string,
    readonly stops: ReadonlyArray<ITripStops>
    readonly route: {
      readonly shortName: string,
    },
  },
}

export interface IStop {
  readonly name: string,
  readonly gtfsId: string,
  readonly stoptimesWithoutPatterns?: ReadonlyArray<IStopTime>
}

export interface IStopTimesResponse {
  readonly stops: ReadonlyArray<IStop>
}

export type StopId = string

export interface IStopTimesQuery {
  readonly stopIds: ReadonlyArray<StopId>,
  readonly numberOfDepartures: number,
}

export type StopTimesRetrieverQueryResult = QueryResult<IStopTimesResponse, IStopTimesQuery>;

class StopTimesQuery extends Query<IStopTimesResponse, IStopTimesQuery> {}

export interface IStopTimesRetrieverProps {
  readonly children: QueryProps['children'],
  readonly stopIds: ReadonlyArray<StopId>,
}

const StopTimesRetriever: React.StatelessComponent<IStopTimesRetrieverProps> = (props: IStopTimesRetrieverProps) => (
  <ApolloClientsContext.Consumer>
    {({ reittiOpas }) =>
      (<StopTimesQuery
          client={reittiOpas}
          query={STOP_TIMES_QUERY}
          variables={{ stopIds: props.stopIds, numberOfDepartures: 10 /*props.displayedRoutes as number*/}}
          pollInterval={20000}
        >
          {props.children}
      </StopTimesQuery>)
    }
  </ApolloClientsContext.Consumer>
);

export default StopTimesRetriever;
