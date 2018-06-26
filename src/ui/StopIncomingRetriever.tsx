import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import {
  DaySeconds,
  EpochSecondsLocal,
  Seconds
} from "src/time";
import StopIncomingList from "src/ui/StopIncomingList";

const STOP_INCOMING_QUERY = gql`
query GetStop($stopId: String!) {
  stop(id: $stopId) {
    name,
    stoptimesWithoutPatterns {
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
    route: {
      shortName: string,
    },
  },
};

export interface IStop {
  name: string,
  stoptimesWithoutPatterns: IStopTime[]
};

interface IStopResponse {
  stop: IStop
}

export type StopId = string

interface IStopQuery {
  stopId: StopId,
};

class StopIncomingQuery extends Query<IStopResponse, IStopQuery> {}

export interface IStopIncomingRetrieverProps {
  stopIds: StopId[],
};

const StopIncomingRetriever = (props: IStopIncomingRetrieverProps) => (
  <StopIncomingQuery
    query={STOP_INCOMING_QUERY}
    variables={{ stopId: props.stopIds[0]}}
    pollInterval={20000}
  >
    {(result: QueryResult<IStopResponse, IStopQuery>): React.ReactNode => {
      if (result.loading) {
        return (<div>Ladataan…</div>);
      }
      if (!result || !result.data) {
        return (<div>
          {`Virhe haettaessa pysäkkiä ${props.stopIds[0]}.`}
        </div>);
      }
      if (result.data.stop === null) {
        return (<div>
          {`Haettua pysäkkiä ${props.stopIds[0]} ei löytynyt.`}
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

export default StopIncomingRetriever;
