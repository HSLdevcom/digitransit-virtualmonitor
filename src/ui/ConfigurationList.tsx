import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";

import ConfigEditor from "src/ui/ConfigEditor";
import ConfigurationRetriever, { ConfigurationRetrieverResult } from 'src/ui/ConfigurationRetriever';
import { ILatLon } from "src/ui/LatLonEditor";
import { ApolloClientsContext } from "src/VirtualMonitorApolloClients";

interface ITranslatedString {
  readonly [twoLetterLanguageCode: string]: string,
};

interface IStop {
  readonly gtfsId: string,
};

export interface IViewBase {
  readonly title?: ITranslatedString,
  readonly type: string,
};

export interface IView extends IViewBase {
  readonly stops: {
    readonly [gtfsId: string]: IStop,
  },
};

export interface IViewCarouselElement {
  view: IView,
  displayTime: number,
};

export type IViewCarousel = ReadonlyArray<IViewCarouselElement>;

export interface IDisplay {
  readonly position?: ILatLon,
  readonly name: string,
  readonly viewCarousel: ReadonlyArray<{
    view: IView,
    displayTime: number,
  }>,
};

export interface IConfiguration {
  readonly name: string,
  readonly displays: {
    readonly [displayId: string]: IDisplay,
  },
  readonly position?: ILatLon;
};

export interface IConfigurations {
  readonly [configurationName: string]: IConfiguration,
};

export interface IConfigurationListProps {
  readonly configurations: IConfigurations,
};

const createLocalConfigurationMutation = gql`
  mutation createLocalConfiguration($name: String!) {
    createLocalConfiguration(name: $name) @client
  }
`;

const ConfigurationList = ({configurations, t}: IConfigurationListProps & InjectedTranslateProps ) => (
  <ConfigurationRetriever
  >
    {(result: ConfigurationRetrieverResult): React.ReactNode => {
      if (result.loading) {
        return (<div>{t('loading')}</div>);
      }
      if (!result || !result.data) {
        return (<div>
          {t('configurationRetrieveError')} - {result.error}
        </div>);
      }
      if (!result.data.configurations || (result.data.configurations.length <= 0)) {
        return (<div>
          {t('configurationRetrieveNotFound')}
        </div>);
      }
      // return (
      //   <div>
      //     <ConfigurationList
      //       configurations={Object.values(result.data.configurations).reduce((acc, o) => ({...acc, [o.name]:o}), {})}
      //     />
      //     <ConfigurationList
      //       configurations={Object.values(result.data.localConfigurations).reduce((acc, o) => ({...acc, [o.name]:{ ...o, displays: [] } }), {})}
      //     />
      //   </div>
      // );
      return (
        <div>
          {Object.values(result.data.configurations).map((configuration, i) => (
            <ConfigEditor
              key={`${configuration.name}${i}`}
              configuration={configuration}
            />
          ))}
          {<ApolloClientsContext.Consumer>
            {({ virtualMonitor }) =>
              (<Mutation
                mutation={createLocalConfigurationMutation}
                client={virtualMonitor}
              >
                {createLocalConfiguration => (
                  <button onClick={() => createLocalConfiguration({ variables: { name: 'Derp'}}) }>
                    {t('prepareConfiguration')}
                  </button>
                )}
              </Mutation>)
            }
          </ApolloClientsContext.Consumer>}
        </div>
      );
    }}
  </ConfigurationRetriever>
);

export default translate('translations')(ConfigurationList);
