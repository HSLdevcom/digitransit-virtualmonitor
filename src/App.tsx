import * as React from 'react';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';

import 'src/App.css';
import AutoMoment from 'src/ui/AutoMoment';
import HslLogo from 'src/ui/HslLogo';
import StopSelectorSwitch from 'src/ui/StopSelectorSwitch';
import Titlebar from 'src/ui/Titlebar';

import ConfigurationDisplay from 'src/ui/ConfigurationDisplay';
import ConfigurationList from 'src/ui/ConfigurationList';
import DisplayEditor from 'src/ui/DisplayEditor';
import DisplayUrlCompression from 'src/ui/DisplayUrlCompression';
import QuickDisplay from 'src/ui/QuickDisplay';
import StopTimesView from 'src/ui/Views/StopTimesView';

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

class App extends React.Component {
  public render() {
    return (
      <Switch>
        <Route
          path={'/quickDisplay/:version?/:packedDisplay?'}
          component={QuickDisplay}
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
              stopIds={[stopId]}
              displayedRoutes={Number(displayedRoutes)}
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
              <HslLogo />
              <div id={"title-text"}>
                {'Virtuaalimonitori'}
              </div>
              <div id={"title-time"}>
                <AutoMoment />
              </div>
            </Titlebar>
            <Link to={'/quickDisplay'}>
              Create a new display
            </Link>
            {/* <Link to={'/configs/1'}>
              Configs playground
            </Link> */}
            <StopSelectorSwitch />
          </div>
        </Route>
      </Switch>
    );
  }
};

export default App;
