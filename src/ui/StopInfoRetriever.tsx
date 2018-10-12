import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult, QueryProps } from "react-apollo";

import { StopId } from 'src/ui/StopTimesRetriever';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';

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

export interface IStopInfoResponse {
  readonly stopInfos: ReadonlyArray<{
    name: string,
    code?: string,
    desc?: string,
    gtfsId: string,
    platformCode: string,
  }>
};

interface IStopInfoVariables {
  readonly stopIds: ReadonlyArray<StopId>,
};

interface IStopInfoRetrieverProps {
  readonly children: QueryProps['children'],
  readonly stops: ReadonlyArray<StopId>,
};

class StopInfoQuery extends Query<IStopInfoResponse, IStopInfoVariables> {}
const StopInfoRetriver = ({ children, stops }: IStopInfoRetrieverProps) => (
  <ApolloClientsContext.Consumer>
    {({ reittiOpas }) => (
      <StopInfoQuery
        client={reittiOpas}
        variables={{
          stopIds: stops
        }}
        query={STOP_INFO_QUERY}
      >
        {children}
      </StopInfoQuery>
    )}
  </ApolloClientsContext.Consumer>
);
export default StopInfoRetriver;
