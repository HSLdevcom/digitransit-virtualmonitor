import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryProps } from "react-apollo";

import { StopId } from './StopTimesRetriever';
import { ApolloClientsContext } from '../VirtualMonitorApolloClients';

const STOP_INFO_QUERY = gql`
  query GetStopInfos($stopIds: [String]) {
    stopInfos: stops(ids: $stopIds) {
      name
      code
      desc
      gtfsId
      platformCode
    }
  }
`;

export interface IStopInfo {
  name: string,
  code?: string,
  desc?: string,
  gtfsId: StopId,
  platformCode: string,
}

export interface IStopInfoResponse {
  readonly stopInfos: ReadonlyArray<IStopInfo>
}

interface IStopInfoVariables {
  readonly stopIds: ReadonlyArray<StopId>,
}

interface IStopInfoRetrieverProps {
  readonly children: QueryProps<IStopInfoResponse, IStopInfoVariables>['children'],
  readonly stops: ReadonlyArray<StopId>,
}

class StopInfoQuery extends Query<IStopInfoResponse, IStopInfoVariables> {}
const StopInfoRetriver = ({ children, stops }: IStopInfoRetrieverProps) => (
  <ApolloClientsContext.Consumer>
    {({ reittiOpas }) => (
      <StopInfoQuery
        client={reittiOpas}
        query={STOP_INFO_QUERY}
        variables={{
          stopIds: stops
        }}
      >
        {children}
      </StopInfoQuery>
    )}
  </ApolloClientsContext.Consumer>
);
export default StopInfoRetriver;
