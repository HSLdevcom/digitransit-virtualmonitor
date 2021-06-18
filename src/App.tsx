/* eslint-disable no-empty-pattern */
import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import IndexPage from './ui/IndexPage';
import Banner from './ui/Banner';
import ConfigurationDisplay from './ui/ConfigurationDisplay';
import ConfigurationList from './ui/ConfigurationList';
import DisplayEditor from './ui/DisplayEditor';
import DisplayUrlCompression from './ui/DisplayUrlCompression';
import HelpPage from './ui/HelpPage';
import QuickDisplay from './ui/QuickDisplay';
import StopTimesView from './ui/Views/StopTimesView';
import CreateViewPage from './ui/CreateViewPage';
import WithDatabaseConnection from './ui/WithDatabaseConnection';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import './App.scss';
export interface IMonitorConfig {
  //feedIds?: Array<string>;
  uri?: string;
  // Texts for Help page
  urlParamUsageText?: string;
  urlMultipleStopsText?: string;
  urlParamFindText?: string;
  urlParamFindAltText?: string;
}

export interface IQueryString {
  title?: string;
  cont?: string;
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

    const client = new ApolloClient({
      uri: monitorConfig.uri,
      cache: new InMemoryCache(),
    });

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
        <ApolloProvider client={client}>
          <Switch>
            <Route
              path={'/createView'}
              component={({
                match: {
                  params: {},
                },
              }: RouteComponentProps<IMonitorConfig>) => (
                <>
                  <Banner config={monitorConfig} />
                  <CreateViewPage config={monitorConfig} />
                </>
              )}
            />
            <Route
              path={'/quickDisplay/:version?/:packedDisplay?'}
              component={QuickDisplay}
            />
            <Route path={'/view'} component={WithDatabaseConnection} />
            <Route
              path={'/help'}
              // eslint-disable-next-line no-empty-pattern
              component={({
                match: {
                  params: {},
                },
              }: RouteComponentProps<IMonitorConfig>) => (
                <>
                  <Banner config={monitorConfig} />
                  <HelpPage
                    client={client}
                    urlParamUsageText={helpPageUrlParamText}
                    urlMultipleStopsText={helpPageurlMultipleStopsText}
                    urlParamFindText={helpPageUrlParamFindText}
                    urlParamFindAltText={helpPageUrlParamFindAltText}
                    content={this.props.search.cont}
                  />
                </>
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
            <Route
              path={'/configs/:configName?'}
              component={ConfigurationList}
            />
            <Route path={'/displayEditor/'} component={DisplayEditor} />
            <Route
              path={'/'}
              component={({
                match: {
                  params: {},
                },
              }: RouteComponentProps<IMonitorConfig>) => (
                <>
                  <Banner config={monitorConfig} />
                  <IndexPage />
                </>
              )}
            />
          </Switch>
        </ApolloProvider>
      </div>
    );
  }
}

export default withTranslation('translations')(App);
