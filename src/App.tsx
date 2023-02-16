/* eslint-disable no-empty-pattern */
import React, { FC, useEffect, useState, useContext } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import DisplayUrlCompression from './ui/DisplayUrlCompression';
import CreateViewPage from './ui/CreateViewPage';
import Version from './ui/Version';
import BannerContainer from './ui/BannerContainer';
import { Helmet } from 'react-helmet';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  createHttpLink,
} from '@apollo/client';
import monitorAPI from './api';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';
import StopMonitorContainer from './ui/StopMonitorContainer';
import './sass/main.scss';
import SkipToMainContent from './ui/SkipToMainContent';
import PrepareMonitor from './ui/PrepareMonitor';
import { ConfigContext, UserContext, FavouritesContext } from './contexts';
import Loading from './ui/Loading';
import UserMonitors from './ui/UserMonitors';
import ProtectedRoute from './ProtectedRoute';
import { useTranslation } from 'react-i18next';

export interface IExtendedMonitorConfig extends IMonitorConfig {
  fonts?: {
    externalFonts?: Array<string>;
    normal?: string;
    narrow?: string;
    weights?: {
      normal?: string;
      bigger?: string;
    };
    monitor: {
      name: string;
      weight: string;
    };
  };
  colors: {
    alert: string;
    hover?: string;
    monitorBackground: string;
    primary: string;
  };
  alertOrientation: string;
  modeIcons: {
    colors: {
      'mode-airplane'?: string;
      'mode-bus'?: string;
      'mode-tram'?: string;
      'mode-subway'?: string;
      'mode-rail'?: string;
      'mode-ferry'?: string;
      'mode-citybike'?: string;
      'mode-citybike-secondary'?: string;
    };
    postfix: string;
    setName: string;
  };
  allowLogin: boolean;
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
}

export interface IQueryString {
  title?: string;
  cont?: string;
}

export interface IConfigurationProps {
  search?: IQueryString;
}

interface ICompressedDisplayRouteParams {
  version: string;
  packedDisplay: string;
}

interface IStopMonitorProps {
  stopId: string;
  layout?: string;
}

interface User {
  sub?: string;
  notLogged?: boolean;
}

interface Favourite {
  type: string;
}

const App: FC<IConfigurationProps> = props => {
  const [t] = useTranslation();
  const [user, setUser] = useState<User>({});
  const [favourites, setFavourites] = useState<Array<Favourite>>([]);
  const [loading, setLoading] = useState(true);
  const config = useContext(ConfigContext);
  const style = {
    '--alert-color': config.colors.alert,
    '--font-family': config.fonts.normal,
    '--font-family-narrow': config.fonts?.narrow,
    '--font-weight': config.fonts.weights.normal,
    '--font-weight-bigger': config.fonts.weights.bigger,
    '--monitor-background-color': config.colors.monitorBackground,
    '--monitor-font': config.fonts.monitor.name,
    '--monitor-font-weight': config.fonts.monitor.weight,
    '--primary-color': config.colors.primary,
  };
  useEffect(() => {
    if (config.fonts.fontCounter) {
      fetch(config.fonts.fontCounter, {
        mode: 'no-cors',
      });
    }

    for (const i in style) {
      document.body.style.setProperty(i, style[i]);
    }
    if (config.allowLogin) {
      monitorAPI
        .getUser()
        .then(user => {
          setUser(user);
          setLoading(false);
        })
        .catch(() => {
          setUser({ notLogged: true });
          setLoading(false);
        });
      monitorAPI.getFavourites().then((favs: Array<Favourite>) => {
        if (Array.isArray(favourites)) {
          setFavourites(favs);
        }
      });
    } else {
      setUser({ notLogged: true });
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loading white />;
  }

  const client = new ApolloClient({
    link: ApolloLink.from([
      new MultiAPILink({
        endpoints: {
          default: '/api/graphql',
          rail: 'https://rata.digitraffic.fi/api/v2/graphql/graphql',
        },
        httpSuffix: '',
        createHttpLink: () => createHttpLink(),
        getContext: endpoint => {
          if (endpoint === 'default') {
            return { headers: { 'graphql-endpoint': config.uri } };
          }
          return {};
        },
      }),
    ]),
    cache: new InMemoryCache(),
  });

  const favicon = config.name.concat('.png');
  const faviconLink = <link rel="shortcut icon" href={favicon} />;

  const fonts = config.fonts.externalFonts.map(font => (
    <link rel="stylesheet" type="text/css" href={font} />
  ));

  if (localStorage.getItem('lang') == null) {
    localStorage.setItem('lang', 'fi');
  }

  return (
    <div className="App">
      <Helmet>
        <title>
          {config.name} - {t('stop-display')}
        </title>
        {faviconLink}
        {fonts}
      </Helmet>
      <ApolloProvider client={client}>
        <UserContext.Provider value={user}>
          <FavouritesContext.Provider value={favourites}>
            <Switch>
              <Route
                path={'/createview'}
                component={({
                  match: {
                    params: {},
                  },
                }: RouteComponentProps) => (
                  <>
                    <SkipToMainContent />
                    <BannerContainer />
                    <section role="main" id="mainContent">
                      <CreateViewPage />
                    </section>
                  </>
                )}
              />
              <Route path={'/view'} component={PrepareMonitor} />
              <Route path={'/static'} component={PrepareMonitor} />
              <ProtectedRoute
                path={'/monitors/createview'}
                component={({
                  match: {
                    params: {},
                  },
                }: RouteComponentProps) => (
                  <>
                    <SkipToMainContent />
                    <BannerContainer />
                    <section role="main" id="mainContent">
                      <CreateViewPage />
                    </section>
                  </>
                )}
              />
              <ProtectedRoute
                path={'/monitors'}
                component={() => (
                  <>
                    <SkipToMainContent />
                    <BannerContainer />
                    <section role="main" id="mainContent">
                      <UserMonitors />
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
                    layout={layout ? Number(layout) : 8}
                    urlTitle={props.search?.title}
                  />
                )}
              />
              <Route
                path={'/station/:stopId/:layout?'}
                component={({
                  match: {
                    params: { stopId, layout },
                  },
                }: RouteComponentProps<IStopMonitorProps>) => (
                  <StopMonitorContainer
                    stopIds={stopId.split(',')}
                    layout={layout ? Number(layout) : 8}
                    urlTitle={props.search?.title}
                    station
                  />
                )}
              />
              <Route path={'/version'} component={Version} />
              <Route
                path={'/'}
                component={({
                  match: {
                    params: {},
                  },
                }: RouteComponentProps) => (
                  <>
                    <SkipToMainContent />
                    <LandingPage />
                  </>
                )}
              />
            </Switch>
          </FavouritesContext.Provider>
        </UserContext.Provider>
      </ApolloProvider>
    </div>
  );
};

export default App;
