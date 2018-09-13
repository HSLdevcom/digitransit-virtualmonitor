import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryProps, QueryResult } from "react-apollo";

import { IConfiguration } from "src/ui/ConfigurationList";
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';

const CONFIGURATION_QUERY = gql`
query {
  configurations {
    displays {
      name
      viewCarousel {
        view {
          title {
            fi
            en
          }
          type
          ... on TimedRoutesView {
        		stops {
              gtfsId
            }
          }
        }
      }
    }
    name
    position {
      lat
      lon
    }
  }
  localConfigurations @client {
    name
  }
}
`;

interface IConfigurationResponse {
  readonly configurations: ReadonlyArray<IConfiguration>
  readonly localConfigurations: ReadonlyArray<{
    name: string,
  }>,
};

export type ConfigurationRetrieverResult = QueryResult<IConfigurationResponse>;

// interface IConfigurationQuery {
// };

// class ConfigurationQuery extends Query<IConfigurationResponse, IConfigurationQuery> {}
class ConfigurationQuery extends Query<IConfigurationResponse> {}

export interface IConfigurationRetrieverProps {
  children: QueryProps['children'],
};

const ConfigurationRetriever: React.StatelessComponent<IConfigurationRetrieverProps> = (props: IConfigurationRetrieverProps) => (
  <ApolloClientsContext.Consumer>
    {({ virtualMonitor }) =>
      (<ConfigurationQuery
        query={CONFIGURATION_QUERY}
        variables={{}}
        pollInterval={60000}
        client={virtualMonitor}
        children={props.children}
      />)
    }
  </ApolloClientsContext.Consumer>
);

export default ConfigurationRetriever;
