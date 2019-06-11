import * as React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';

import 'src/App.css';
import Logo from 'src/ui/Logo';
import StopSelectorSwitch from 'src/ui/StopSelectorSwitch';
import Titlebar from 'src/ui/Titlebar';

import ConfigurationDisplay from 'src/ui/ConfigurationDisplay';
import ConfigurationList from 'src/ui/ConfigurationList';
import DisplayEditor from 'src/ui/DisplayEditor';
import DisplayUrlCompression from 'src/ui/DisplayUrlCompression';
import QuickDisplay from 'src/ui/QuickDisplay';
import TitlebarTime from 'src/ui/TitlebarTime';
import StopTimesView from 'src/ui/Views/StopTimesView';
import HelpPage from 'src/ui/HelpPage';

interface ICompressedDisplayRouteParams {
  version: string,
  packedDisplay: string
};

interface IConfigurationDisplayRouteParams {
  configuration: string,
  displayName: string,
};

interface IStopRouteParams {
  stopId: string,
  displayedRoutes?: string,
};

class App extends React.Component<InjectedTranslateProps> {
  public render() {
    return (
      <div
        className={'App'}
      >
        <Switch>
          <Route
            path={'/quickDisplay/:version?/:packedDisplay?'}
            component={QuickDisplay}
          />
          <Route
           path={'/help/'}
           component={HelpPage} 
          />
          <Route
            path={'/urld/:version/:packedDisplay'}
            component={({ match: { params: { version, packedDisplay }} }: RouteComponentProps<ICompressedDisplayRouteParams>) => (
              <DisplayUrlCompression
                version={decodeURIComponent(version)}
                packedString={decodeURIComponent(packedDisplay)}
              />
            )}
          />
          <Route
            path={'/configuration/:configuration/display/:display'}
            component={({ match: { params: { configuration, displayName }}}: RouteComponentProps<IConfigurationDisplayRouteParams>) => (
              <ConfigurationDisplay
                configurationName={configuration}
                displayName={displayName}
              />
            )}
          />
          <Route
            path={'/stop/:stopId/:displayedRoutes?'}
            component={({ match: { params: { stopId, displayedRoutes }} }: RouteComponentProps<IStopRouteParams>) => (
              <StopTimesView
                stopIds={stopId.split(",")}
                displayedRoutes={displayedRoutes ? Number(displayedRoutes) : undefined}
              />
            )}
          />
          <Route
            path={'/configs/:configName?'}
            component={ConfigurationList}
          />
          <Route
            path={'/displayEditor/'}
            component={DisplayEditor}
          />
          <Route>
            <div id={'stop-search'}>
              <Titlebar>
                <Logo />
                <div id={"title-text"}>
                  {this.props.t('titlebarTitle')}
                </div>
                <TitlebarTime />
              </Titlebar>
              <Link to={'/quickDisplay'}>
                {this.props.t('quickDisplayCreate')}
              </Link>
              {/* <Link to={'/configs/1'}>
                Configs playground
              </Link> */}
              <StopSelectorSwitch />
            </div>
          </Route>
        </Switch>
      </div>
    );
  }
};

export default translate('translations')(App);
