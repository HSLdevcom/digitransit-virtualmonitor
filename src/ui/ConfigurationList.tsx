import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";

import ConfigEditor from "src/ui/ConfigEditor";
import ConfigurationRetriever, { ConfigurationRetrieverResult } from 'src/ui/ConfigurationRetriever';
import { ILatLon } from "src/ui/LatLonEditor";
import { ApolloClientsContext } from "src/VirtualMonitorApolloClients";

interface INode {
  readonly id: string,
};

interface ITranslatedString {
  readonly [twoLetterLanguageCode: string]: string,
};

export interface IStop extends INode {
  readonly gtfsId: string,
  readonly overrideStopName?: string,
};

export interface IViewBase extends INode {
  readonly title?: ITranslatedString,
  readonly type: string,
};

export interface IStopTimesView extends IViewBase {
  readonly displayedRoutes?: number,
  readonly pierColumnTitle?: string,
  readonly stops: {
    readonly [gtfsId: string]: IStop,
  },
};

type AnyView = IStopTimesView;

export interface IViewCarouselElement extends INode {
  readonly view: AnyView,
  readonly displaySeconds: number,
};

export type IViewCarousel = ReadonlyArray<IViewCarouselElement>;

export interface IDisplay extends INode {
  readonly position?: ILatLon,
  readonly name: string,
  readonly viewCarousel: IViewCarousel,
};

export interface IConfiguration extends INode {
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
          {t('configurationRetrieveError')} - {result.error ? result.error.message : 'Weird...'}
        </div>);
      }
      if (!result.data.configurations || (result.data.configurations.length <= 0)) {
        return (<div>
          {t('configurationRetrieveNotFound')}
        </div>);
      }
      return (
        <div>
          {Object.values([...result.data.configurations, ...(result.data.localConfigurations || [])] ).map((configuration, i) => (
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
                  <button onClick={() => createLocalConfiguration({ variables: {name: 'Derp'}}) }>
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
