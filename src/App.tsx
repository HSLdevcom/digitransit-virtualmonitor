/* eslint-disable no-empty-pattern */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import Breadcrumbs from './ui/Breadcrumbs';
import Banner from './ui/Banner';
import DisplayUrlCompression from './ui/DisplayUrlCompression';
import HelpPage from './ui/HelpPage';
import CreateViewPage from './ui/CreateViewPage';
import Version from './ui/Version';
import WithDatabaseConnection from './ui/WithDatabaseConnection';
import {
  defaultColorAlert,
  defaultColorFont,
  defaultFontNarrow,
  defaultFontNormal,
} from './ui/DefaultStyles';
import { Helmet } from 'react-helmet';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  createHttpLink,
} from '@apollo/client';

import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';
import StopMonitorContainer from './ui/StopMonitorContainer';

import './sass/main.scss';

import SkipToMainContent from './ui/SkipToMainContent';

export interface IExtendedMonitorConfig extends IMonitorConfig {
  fonts?: {
    normal?: string;
    narrow?: string;
  };
  colors?: {
    alert?: string;
    font?: string;
    hover?: string;
    monitorBackground?: string;
    primary?: string;
  };
  alertOrientation?: string;
  modeIcons?: {
    borderRadius?: string;
    colors?: {
      'mode-airplane'?: string;
      'mode-bus'?: string;
      'mode-tram'?: string;
      'mode-subway'?: string;
      'mode-rail'?: string;
      'mode-ferry'?: string;
      'mode-citybike'?: string;
      'mode-citybike-secondary'?: string;
    };
    postfix?: string;
    setName?: string;
  };
}
export interface IMonitorConfig {
  name?: string;
  //feedIds?: Array<string>;
  uri?: string;
  // Texts for Help page
  urlParamUsageText?: string;
  urlMultipleStopsText?: string;
  urlParamFindText?: string;
  urlParamFindAltText?: string;
  showMinutes?: string;
  breadCrumbsStartPage?: string;
}

export interface IQueryString {
  title?: string;
  cont?: string;
  pocLogin?: boolean;
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

const App: React.FC<combinedConfigurationAndInjected & WithTranslation> = (
  props: combinedConfigurationAndInjected & WithTranslation,
) => {
  // ---------- TODO: POC / DEBUG PURPOSES ONLY ----------
  const user = {
    loggedIn: true,
    urls: ['abcdef', 'ghijk'],
  };
  // ----------                                 ----------
  const monitorConfig: IExtendedMonitorConfig = props.monitorConfig;

  const client = new ApolloClient({
    link: ApolloLink.from([
      new MultiAPILink({
        endpoints: {
          default: monitorConfig.uri,
          hsl: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
          rail: 'https://rata.digitraffic.fi/api/v2/graphql/graphql',
        },
        httpSuffix: '',
        createHttpLink: () => createHttpLink(),
      }),
    ]),
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

  const style = {
    '--alert-color': monitorConfig.colors.alert || defaultColorAlert,
    '--font-color': monitorConfig.colors.font || defaultColorFont,
    '--font-family': monitorConfig.fonts?.normal || defaultFontNormal,
    '--font-family-narrow': monitorConfig.fonts?.narrow || defaultFontNarrow,
    '--monitor-background-color':
      monitorConfig.colors.monitorBackground || monitorConfig.colors.primary,
    '--primary-color': monitorConfig.colors.primary,
  } as React.CSSProperties;

  const favicon = monitorConfig.name.concat('.png');
  const faviconLink = <link rel="shortcut icon" href={favicon} />;
  return (
    <div className="App" style={style}>
      <Helmet>
        <title>{monitorConfig.name} - pysäkkinäyttö</title>
        {faviconLink}
      </Helmet>
      <SkipToMainContent />
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
                <section aria-label="navigation">
                  <Banner config={monitorConfig} />
                  <Breadcrumbs start={monitorConfig.breadCrumbsStartPage} />
                </section>
                <section role="main" id="mainContent">
                  <CreateViewPage config={monitorConfig} />
                </section>
              </>
            )}
          />
          <Route
            path={'/createStaticView'}
            component={({
              match: {
                params: {},
              },
            }: RouteComponentProps<IMonitorConfig>) => (
              <>
                <section aria-label="navigation">
                  <Banner config={monitorConfig} />
                  <Breadcrumbs
                    isLogged={user.loggedIn}
                    start={monitorConfig.breadCrumbsStartPage}
                  />
                </section>
                <section role="main" id="mainContent">
                  <CreateViewPage config={monitorConfig} user={user} />
                </section>
              </>
            )}
          />
          <Route path={'/view'} component={WithDatabaseConnection} />
          <Route path={'/static'} component={WithDatabaseConnection} />
          <Route path={'/version'} component={Version} />
          <Route
            path={'/help'}
            // eslint-disable-next-line no-empty-pattern
            component={({
              match: {
                params: {},
              },
            }: RouteComponentProps<IMonitorConfig>) => (
              <>
                <section aria-label="navigation">
                  <Banner config={monitorConfig} />
                  <Breadcrumbs
                    isLogged={user.loggedIn}
                    start={monitorConfig.breadCrumbsStartPage}
                  />
                </section>
                <section role="main" id="mainContent">
                  <HelpPage
                    urlParamUsageText={helpPageUrlParamText}
                    urlMultipleStopsText={helpPageurlMultipleStopsText}
                    urlParamFindText={helpPageUrlParamFindText}
                    urlParamFindAltText={helpPageUrlParamFindAltText}
                    content={props.search.cont}
                  />
                </section>
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
                urlTitle={props.search?.title}
              />
            )}
          />
          <Route
            path={'/'}
            component={({
              match: {
                params: {},
              },
            }: RouteComponentProps<IMonitorConfig>) => (
              <>
                <LandingPage
                  login={props.search?.pocLogin}
                  config={monitorConfig}
                />
              </>
            )}
          />
        </Switch>
      </ApolloProvider>
    </div>
  );
};

export default withTranslation('translations')(App);
