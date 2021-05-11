import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import { WithTranslation, withTranslation } from "react-i18next";
import { ApolloClientsContext } from '../VirtualMonitorApolloClients';

export const STOP_INFO_QUERY = gql`
query GetStop($stopId: String!) {
  stop(id: $stopId) {
    name,
  }
}
`;

export interface IStopInfo {
  readonly name: string,
};

interface IStopInfoResponse {
  readonly stop: IStopInfo,
};

interface IStopQuery {
  readonly stopId: string,
};

class StopInfoQuery extends Query<IStopInfoResponse, IStopQuery> {}

export interface IStopInfoProps {
  readonly stopIds: ReadonlyArray<string>,
};

const StopName = (props: IStopInfoProps & WithTranslation) => (
  <ApolloClientsContext.Consumer>
    {({ reittiOpas }) =>
      (<StopInfoQuery
        query={STOP_INFO_QUERY}
        variables={{ stopId: props.stopIds[0]}}
        client={reittiOpas}
      >
        {(result: QueryResult<IStopInfoResponse, IStopQuery>): React.ReactNode => {
          const notLoaded = () => (
            <div>
              {props.t('stop', { stop: props.stopIds[0]})}
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
            <div style={{ wordBreak: 'break-all' }}>
              {result.data.stop.name}
            </div>
          );
        }}
      </StopInfoQuery>)
    }
  </ApolloClientsContext.Consumer>
);

export default withTranslation('translations')(StopName);
