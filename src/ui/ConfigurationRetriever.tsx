import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";

import ConfigurationList, { IConfiguration } from "src/ui/ConfigurationList";
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
}
`;
/*
localConfigurations @client {
  name
}*/

interface IConfigurationResponse {
  readonly configurations: ReadonlyArray<IConfiguration>
  readonly localConfigurations: ReadonlyArray<{
    name: string,
  }>,
};

// interface IConfigurationQuery {
// };

// class ConfigurationQuery extends Query<IConfigurationResponse, IConfigurationQuery> {}
class ConfigurationQuery extends Query<IConfigurationResponse> {}

export interface IConfigurationRetrieverProps {
};

const ConfigurationRetriever: React.StatelessComponent<IConfigurationRetrieverProps> = (props: IConfigurationRetrieverProps & InjectedTranslateProps) => (
  <ApolloClientsContext.Consumer>
    {({ virtualMonitor }) =>
      (<ConfigurationQuery
        query={CONFIGURATION_QUERY}
        variables={{}}
        pollInterval={60000}
        client={virtualMonitor}
      >
        {(result: QueryResult<IConfigurationResponse>): React.ReactNode => {
          if (result.loading) {
            return (<div>{props.t('loading')}</div>);
          }
          if (!result || !result.data) {
            return (<div>
              {props.t('configurationRetrieveError')} - {result.error}
            </div>);
          }
          if (!result.data.configurations || (result.data.configurations.length <= 0)) {
            return (<div>
              {props.t('configurationRetrieveNotFound')}
            </div>);
          }
          return (
            <div>
              <ConfigurationList
                configurations={Object.values(result.data.configurations).reduce((acc, o) => ({...acc, [o.name]:o}), {})}
              />
              {/* <ConfigurationList
                configurations={Object.values(result.data.localConfigurations).reduce((acc, o) => ({...acc, [o.name]:{ ...o, displays: [] } }), {})}
              /> */}
            </div>
          );
        }}
      </ConfigurationQuery>)
    }
  </ApolloClientsContext.Consumer>
);

ConfigurationRetriever.defaultProps = {
  displayedRoutes: 12,
};

export default translate('translations')(ConfigurationRetriever);
