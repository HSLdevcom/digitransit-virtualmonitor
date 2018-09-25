import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryProps, QueryResult } from "react-apollo";

import {
  DaySeconds,
  EpochSecondsLocal,
  Seconds
} from "src/time";
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';

const STOP_INCOMING_QUERY = gql`
query GetStops($stopIds: [String], $numberOfDepartures: Int!) {
  stops(ids: $stopIds) {
    name,
    gtfsId,
    stoptimesWithoutPatterns(numberOfDepartures: $numberOfDepartures) {
      stop {
        gtfsId
        platformCode
      }
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
  stop?: {
    gtfsId: number,
    overrideStopName?: string, // Added locally from configuration.
    platformCode?: string,
  },
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

interface IStop {
  name: string,
  gtfsId: string,
  stoptimesWithoutPatterns?: IStopTime[]
};

export interface IStopResponse {
  readonly stops: ReadonlyArray<IStop>
}

export type StopId = string

export interface IStopQuery {
  stopIds: ReadonlyArray<StopId>,
  numberOfDepartures: number,
};

export type StopIncomingRetrieverQueryResult = QueryResult<IStopResponse, IStopQuery>;

class StopIncomingQuery extends Query<IStopResponse, IStopQuery> {}

export interface IStopIncomingRetrieverProps {
  readonly children: QueryProps['children'],
  readonly stopIds: ReadonlyArray<StopId>,
};

const StopIncomingRetriever: React.StatelessComponent<IStopIncomingRetrieverProps> = (props: IStopIncomingRetrieverProps) => (
  <ApolloClientsContext.Consumer>
    {({ reittiOpas }) =>
      (<StopIncomingQuery
          client={reittiOpas}
          query={STOP_INCOMING_QUERY}
          variables={{ stopIds: props.stopIds, numberOfDepartures: 10 /*props.displayedRoutes as number*/}}
          pollInterval={20000}
        >
          {props.children}
      </StopIncomingQuery>)
    }
  </ApolloClientsContext.Consumer>
);

export default StopIncomingRetriever;
