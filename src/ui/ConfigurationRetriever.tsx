import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryProps, QueryResult } from "react-apollo";

import { IConfiguration } from "src/ui/ConfigurationList";
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';

const ConfigurationFieldsFragment = gql`
fragment configurationFields on Configuration {
  displays {
      name
      viewCarousel {
        displaySeconds
        view {
          title {
            fi
            en
          }
          type
          ... on StopTimesView {
        		stops {
              gtfsId
              overrideStopName
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
`;

const CONFIGURATION_QUERY = gql`
${ConfigurationFieldsFragment}

query getConfigurations($ids: [String], $name: String) {
  configurations(ids: $ids, name: $name) {
    ...configurationFields,
  }

  localConfigurations @client {
    ...configurationFields,
  }
}
`;

interface IConfigurationResponse {
  readonly configurations: ReadonlyArray<IConfiguration>
  readonly localConfigurations: ReadonlyArray<IConfiguration>,
};

export type ConfigurationRetrieverResult = QueryResult<IConfigurationResponse>;

type IConfigurationQuery = {
  readonly ids?: ReadonlyArray<string>,
} | {
  readonly name?: string,
};

class ConfigurationQuery extends Query<IConfigurationResponse, IConfigurationQuery> {}

// Props can be without both or with either ids or name. When no params given, retrieves all configurations.
interface IConfigurationRetrieverCommonProps {
  readonly children: QueryProps['children'],
};

interface IConfigurationRetrieverPropsWithId extends IConfigurationRetrieverCommonProps {
  readonly ids: ReadonlyArray<string>,
};

interface IConfigurationRetrieverPropsWithName extends IConfigurationRetrieverCommonProps{
  readonly name: string,
};

const ConfigurationRetriever: React.SFC<IConfigurationRetrieverCommonProps | IConfigurationRetrieverPropsWithId | IConfigurationRetrieverPropsWithName> = (props: IConfigurationRetrieverCommonProps | IConfigurationRetrieverPropsWithId | IConfigurationRetrieverPropsWithName) => {
  const ids = (props as IConfigurationRetrieverPropsWithId).ids;
  const name = (props as IConfigurationRetrieverPropsWithName).name;

  let vars: { ids?: IConfigurationRetrieverPropsWithId['ids'], name?: IConfigurationRetrieverPropsWithName['name']};
  if (ids && name) {
    throw new TypeError("Component of type can not have both 'ids' and 'name' props.");
  } else if (ids) {
    vars = {
      ids,
    };
  } else if (name) {
    vars = {
      name,
    };
  } else {
    // Show all results.
    vars = {};
  }

  return (
    <ApolloClientsContext.Consumer>
      {({ virtualMonitor }) =>
        (<ConfigurationQuery
          query={CONFIGURATION_QUERY}
          variables={vars}
          pollInterval={60000}
          client={virtualMonitor}
          children={props.children}
        />)
      }
    </ApolloClientsContext.Consumer>
  );
};

export default ConfigurationRetriever;
