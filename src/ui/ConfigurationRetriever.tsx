import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";
import ConfigurationList, { IConfiguration } from "./ConfigurationList";

const CONFIGURATION_QUERY = gql`
query configurations{
  name
}
`;

interface IConfigurationResponse {
  readonly configurations: ReadonlyArray<IConfiguration>
}

interface IConfigurationQuery {
};

class ConfigurationQuery extends Query<IConfigurationResponse, IConfigurationQuery> {}

export interface IConfigurationRetrieverProps {
};

const ConfigurationRetriever: React.StatelessComponent<IConfigurationRetrieverProps> = (props: IConfigurationRetrieverProps & InjectedTranslateProps) => (
  <ConfigurationQuery
    query={CONFIGURATION_QUERY}
    variables={{}}
    pollInterval={60000}
  >
    {(result: QueryResult<IConfigurationResponse, IConfigurationQuery>): React.ReactNode => {
      if (result.loading) {
        return (<div>{props.t('loading')}</div>);
      }
      if (!result || !result.data) {
        return (<div>
          {props.t('configurationRetrieveError')}
        </div>);
      }
      if (!result.data.configurations || (result.data.configurations.length <= 0)) {
        return (<div>
          {props.t('configurationRetrieveNotFound')}
        </div>);
      }
      return (
        <ConfigurationList
          configurations={Object.entries(result.data.configurations).reduce((acc, o) => ({...acc, o}), {})}
        />
      );
    }}
  </ConfigurationQuery>
);

ConfigurationRetriever.defaultProps = {
  displayedRoutes: 12,
};

export default translate('translations')(ConfigurationRetriever);
