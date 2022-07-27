/* eslint-disable no-empty-pattern */
import React, { FC, useEffect, useState, useContext } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import DisplayUrlCompression from './ui/DisplayUrlCompression';
import CreateViewPage from './ui/CreateViewPage';
import Version from './ui/Version';
import BannerContainer from './ui/BannerContainer';
import {
  defaultColorAlert,
  defaultColorFont,
  defaultFontNarrow,
  defaultFontNormal,
  defaultFontWeightNormal,
  defaultFontWeightBigger,
} from './ui/DefaultStyles';
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

export interface IExtendedMonitorConfig extends IMonitorConfig {
  fonts?: {
    normal?: string;
    narrow?: string;
    weights?: {
      normal?: string;
      bigger?: string;
    };
    monitor?: {
      name?: string;
      weights?: {
        normal?: string;
        bigger?: string;
      };
    };
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
  allowLogin?: boolean;
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

const App: FC<IConfigurationProps> = (props) => {
  const [user, setUser] = useState<any>({});
  const [favourites, setFavourites] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const config = useContext(ConfigContext);
  const style = {
    '--alert-color': config.colors.alert || defaultColorAlert,
    '--font-color': config.colors.font || defaultColorFont,
    '--font-family': config.fonts?.normal || defaultFontNormal,
    '--font-family-narrow': config.fonts?.narrow || defaultFontNarrow,
    '--font-weight':
      config.fonts?.weights?.normal || defaultFontWeightNormal,
    '--font-weight-bigger':
      config.fonts?.weights?.bigger || defaultFontWeightBigger,
    '--monitor-background-color':
      config.colors.monitorBackground || config.colors.primary,
    '--monitor-font': config.fonts?.monitor?.name || defaultFontNarrow,
    '--monitor-font-weight':
      config.fonts?.monitor?.weights?.normal || defaultFontWeightNormal,
    '--monitor-font-weight-bigger':
      config.fonts?.monitor?.weights?.bigger || defaultFontWeightBigger,
    '--primary-color': config.colors.primary,
  };
  useEffect(() => {
    for (const i in style) {
      document.body.style.setProperty(i, style[i]);
    }
    if (config.allowLogin) {
      monitorAPI.getUser().then(user => {
        setUser(user); 
        setLoading(false);
      }).catch(() => {
        setUser({notLogged: true}); 
        setLoading(false);
      })
      monitorAPI.getFavourites().then(favs => {
        setFavourites(favs)
      }).catch(e => {
        console.log(e)
      })
    }
    
  }, []);
  const client = new ApolloClient({
    link: ApolloLink.from([
      new MultiAPILink({
        endpoints: {
          default: config.uri,
          hsl: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
          rail: 'https://rata.digitraffic.fi/api/v2/graphql/graphql',
        },
        httpSuffix: '',
        createHttpLink: () => createHttpLink(),
      }),
    ]),
    cache: new InMemoryCache(),
  });

  const favicon = config.name.concat('.png');
  const faviconLink = <link rel="shortcut icon" href={favicon} />;
  const fontHSL = (
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cloud.typography.com/6364294/7432412/css/fonts.css"
    />
  );
  const fontDefault = (
    <link
      rel="stylesheet"
      href="https://digitransit-prod-cdn-origin.azureedge.net/matka-fonts/roboto/roboto+montserrat.css"
    />
  );

  const fontTampere = (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Lato"
    />
  );
  if (loading) {
    return <Loading white/>
  }
  const getAdditionalFont = name => {
    switch (name) {
      case 'tampere':
        return fontTampere;
      default:
        return null;
    }
  };
  return (
    <div className="App">
      <Helmet>
        <title>{config.name} - pysäkkinäyttö</title>
        {faviconLink}
        {config.name === 'hsl' ? fontHSL : fontDefault}
        {getAdditionalFont(config.name)}
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
                  <CreateViewPage  />
                </section>
              </>
            )}
          />
          <ProtectedRoute path={'/monitors'} component={() => (
            <>
              <BannerContainer />
              <UserMonitors />
            </>
          )} />       
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
                urlTitle={props.search?.title}
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
