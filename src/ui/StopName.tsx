import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";

const STOP_INFO_QUERY = gql`
query GetStop($stopId: String!) {
  stop(id: $stopId) {
    name,
  }
}
`;

export interface IStopInfo {
  name: string,
};

interface IStopInfoResponse {
  stop: IStopInfo,
};

interface IStopQuery {
  stopId: string,
};

class StopIncomingQuery extends Query<IStopInfoResponse, IStopQuery> {}

export interface IStopInfoProps {
  stopIds: string[],
};

const StopName = (props: IStopInfoProps) => (
  <StopIncomingQuery
    query={STOP_INFO_QUERY}
    variables={{ stopId: props.stopIds[0]}}
  >
    {(result: QueryResult<IStopInfoResponse, IStopQuery>): React.ReactNode => {
      const notLoaded = () => (
        <div>
          {`Pysäkki ${props.stopIds[0]}`}
        </div>
      )
      if (result.loading) {
        return notLoaded();
      }
      if (!result || !result.data) {
        return notLoaded();
      }
      if (result.data.stop === null) {
        return notLoaded();
      }
      return (
        <div>
          {result.data.stop.name}
        </div>
      );
    }}
  </StopIncomingQuery>
);

export default StopName;
