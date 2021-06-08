import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import IndexPage from "./IndexPage";
import ConfigurationDisplay from './ui/ConfigurationDisplay';
import ConfigurationList from './ui/ConfigurationList';
import DisplayEditor from './ui/DisplayEditor';
import DisplayUrlCompression from './ui/DisplayUrlCompression';
import HelpPage from './ui/HelpPage';
import QuickDisplay from './ui/QuickDisplay';
import StopTimesView from './ui/Views/StopTimesView';
import CreateViewPage from './ui/CreateViewPage';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  cache: new InMemoryCache(),
});
import './App.scss';

export interface IMonitorConfig {
  feedId?: string;
  uri?: string;
  // Texts for Help page
  urlParamUsageText?: string;
  urlMultipleStopsText?: string;
  urlParamFindText?: string;
  urlParamFindAltText?: string;
}

export interface IQueryString {
  title?: string;
}

export interface IConfigurationProps {
  monitorConfig?: IMonitorConfig;
  search?: IQueryString;
}

interface ICompressedDisplayRouteParams {
  version: string;
  packedDisplay: string;
}

interface IConfigurationDisplayRouteParams {
  configuration: string;
  displayName: string;
}

interface IStopRouteParams {
  stopId: string;
  displayedRoutes?: string;
  search?: string;
}

export type combinedConfigurationAndInjected = IConfigurationProps &
  WithTranslation;

class App extends React.Component<combinedConfigurationAndInjected, any> {
  constructor(props: combinedConfigurationAndInjected) {
    super(props);
  }
  render() {
    const monitorConfig = this.props.monitorConfig;

    let helpPageUrlParamText = '';
    let helpPageurlMultipleStopsText = '';
    let helpPageUrlParamFindText = '';
    let helpPageUrlParamFindAltText = '';

    if (monitorConfig) {
      // set texts for help page.
      helpPageUrlParamText = monitorConfig.urlParamUsageText
        ? monitorConfig.urlParamUsageText
        : '';
      helpPageurlMultipleStopsText = monitorConfig.urlMultipleStopsText
        ? monitorConfig.urlMultipleStopsText
        : '';
      helpPageUrlParamFindText = monitorConfig.urlParamFindText
        ? monitorConfig.urlParamFindText
        : '';
      helpPageUrlParamFindAltText = monitorConfig.urlParamFindAltText
        ? monitorConfig.urlParamFindAltText
        : '';
    }

    return (
      <div className={'App'}>
        <Switch>
          <Route
            path={'/createView'}
            component={({ match: { params: {}} }: RouteComponentProps<IMonitorConfig>) => (
              <ApolloProvider client={client}>
                    <CreateViewPage />
              </ApolloProvider>

           )}
          />
          <Route
            path={'/quickDisplay/:version?/:packedDisplay?'}
            component={QuickDisplay}
          />
          <Route
           path={'/help/'}
           // eslint-disable-next-line no-empty-pattern
           component={({ match: { params: {}} }: RouteComponentProps<IMonitorConfig>) => (
               <ApolloProvider client={client}>
                     <HelpPage
                         client={client}
                         urlParamUsageText={helpPageUrlParamText}
                         urlMultipleStopsText={helpPageurlMultipleStopsText}
                         urlParamFindText={helpPageUrlParamFindText}
                         urlParamFindAltText={helpPageUrlParamFindAltText}
                     />
               </ApolloProvider>

            )}
          />
          <Route
            path={'/urld/:version/:packedDisplay'}
            component={({
              match: {
                params: { version, packedDisplay },
              },
            }: RouteComponentProps<ICompressedDisplayRouteParams>) => {
              return (
                <>
                  <DisplayUrlCompression
                    version={decodeURIComponent(version)}
                    packedString={decodeURIComponent(packedDisplay)}
                  />
                </>
              );
            }}
          />
          <Route
            path={'/configuration/:configuration/display/:display'}
            component={({
              match: {
                params: { configuration, displayName },
              },
            }: RouteComponentProps<IConfigurationDisplayRouteParams>) => (
              <ConfigurationDisplay
                configurationName={configuration}
                displayName={displayName}
              />
            )}
          />
          <Route
            path={'/stop/:stopId/:displayedRoutes?'}
            component={({
              match: {
                params: { stopId, displayedRoutes },
              },
            }: RouteComponentProps<IStopRouteParams>) => (
              <StopTimesView
                stopIds={stopId.split(',')}
                displayedRoutes={
                  displayedRoutes ? Number(displayedRoutes) : undefined
                }
                monitorConfig={monitorConfig}
                urlTitle={this.props.search?.title}
              />
            )}
          />
          <Route path={'/configs/:configName?'} component={ConfigurationList} />
          <Route path={'/displayEditor/'} component={DisplayEditor} />
          <Route path={'/'} component={IndexPage} />
        </Switch>
      </div>
    );
  }
}

export default withTranslation('translations')(App);
