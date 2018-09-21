import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import 'src/App.css';
import AutoMoment from 'src/ui/AutoMoment';
import HslLogo from 'src/ui/HslLogo';
import StopSelectorSwitch from 'src/ui/StopSelectorSwitch';
import Titlebar from 'src/ui/Titlebar';

import ConfigurationDisplay from 'src/ui/ConfigurationDisplay';
import ConfigurationList from 'src/ui/ConfigurationList';
import TimedRoutesView from 'src/ui/Views/TimedRoutesView';

const RouteWrapper = ({ match }: any) => (
  <TimedRoutesView
    stops={[match.params.stopId]}
    displayedRoutes={match.params.displayedRoutes}
    overrideStopNames={{}}
  />
);

const RouteWrapperConfig = ({ match }: any) => (
  <ConfigurationDisplay
    configurationName={match.params.configuration}
    displayName={match.params.display}
  />
);

class App extends React.Component {
  public render() {
    return (
      <Switch>
        <Route
          path={'/configuration/:configuration/display/:display'}
          component={RouteWrapperConfig}
        />
        <Route
          path={'/stop/:stopId/:displayedRoutes?'}
          component={RouteWrapper}
        />
        <Route
          path={'/configs/:configName?'}
          component={ConfigurationList}
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
            <Link to={'/configs/1'}>
              Configs playground
            </Link>
            <StopSelectorSwitch />
          </div>
        </Route>
      </Switch>
    );
  }
};

export default App;
