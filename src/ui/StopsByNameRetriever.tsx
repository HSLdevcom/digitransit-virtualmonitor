import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryProps } from "react-apollo";

import { ApolloClientsContext } from '../VirtualMonitorApolloClients';

export const STOPS_BY_NAME_QUERY = gql`
	query GetStop($phrase: String!) {
		stops(name: $phrase) {
      name,
      gtfsId,
      code,
		}
	}
`;

export interface IStopWithName {
  readonly name: string,
  readonly gtfsId: string,
  readonly code: string,
}

export interface IStopsByNameResponse {
	readonly stops: ReadonlyArray<IStopWithName>,
}

export interface IStopsByNameQuery {
  readonly phrase: string,
}


export interface IStopsByNameRetrieverProps {
  readonly children: QueryProps<IStopsByNameResponse, IStopsByNameQuery>['children'],
  readonly phrase: string,
}

class StopsByNameQuery extends Query<IStopsByNameResponse, IStopsByNameQuery> {}
const StopsByNameRetriever: React.SFC<IStopsByNameRetrieverProps> = ({ phrase, children }) => (
  <ApolloClientsContext.Consumer>
    {({ reittiOpas }) => (
      <StopsByNameQuery
        client={reittiOpas}
        query={STOPS_BY_NAME_QUERY}
        variables={{ phrase }}
      >
        {children}
      </StopsByNameQuery>
    )}
  </ApolloClientsContext.Consumer>
);

export default StopsByNameRetriever;
