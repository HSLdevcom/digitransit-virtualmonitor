/* eslint-disable no-empty-pattern */
import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import Breadcrumbs from './ui/Breadcrumbs';
import IndexPage from './ui/IndexPage';
import Banner from './ui/Banner';
import ConfigurationDisplay from './ui/ConfigurationDisplay';
import ConfigurationList from './ui/ConfigurationList';
import DisplayEditor from './ui/DisplayEditor';
import DisplayUrlCompression from './ui/DisplayUrlCompression';
import HelpPage from './ui/HelpPage';
import QuickDisplay from './ui/QuickDisplay';
import UserMonitors from './ui/UserMonitors';
import CreateViewPage from './ui/CreateViewPage';
import WithDatabaseConnection from './ui/WithDatabaseConnection';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import './App.scss';
import StopMonitorContainer from './ui/StopMonitorContainer';
export interface IMonitorConfig {
  //feedIds?: Array<string>;
  uri?: string;
  // Texts for Help page
  urlParamUsageText?: string;
  urlMultipleStopsText?: string;
  urlParamFindText?: string;
  urlParamFindAltText?: string;
  showMinutes?: string;
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

interface IStopMonitorProps {
  stopId: string;
  layout?: string;
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
                  <Breadcrumbs />
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
              path={'/user/:id/monitors'}
              component={({
                match: {
                  params: {},
                },
              }: RouteComponentProps<IMonitorConfig>) => (
                <>
                  <Banner config={monitorConfig} />
                  <Breadcrumbs />
                  <UserMonitors />
                </>
              )}
            />
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
                  <Breadcrumbs />
                  <HelpPage
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
              path={'/stop/:stopId/:layout?'}
              component={({
                match: {
                  params: { stopId, layout },
                },
              }: RouteComponentProps<IStopMonitorProps>) => (
                <StopMonitorContainer
                  stopIds={stopId.split(',')}
                  layout={layout ? Number(layout) : 2}
                  config={monitorConfig}
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
                  <Breadcrumbs />
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
