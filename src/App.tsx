import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import 'src/App.css';
import AutoMoment from 'src/ui/AutoMoment';
import HslLogo from 'src/ui/HslLogo';
import StopSelectorSwitch from 'src/ui/StopSelectorSwitch';
import Titlebar from 'src/ui/Titlebar';
import VirtualMonitor from 'src/ui/VirtualMonitor'
import Config from './ui/Config';

import confs from './configPlayground';

const RouteWrapper = ({ match }: any) => (
  <VirtualMonitor
    stops={[match.params.stopId]}
    displayedRoutes={match.params.displayedRoutes}
    // title={'Jokupysäkki'}
  />
);

const Wrapper = () => (<Config configuration={confs.kamppi}/>);

class App extends React.Component {
  public render() {
    return (
      <Switch>
        <Route
          path={'/stop/:stopId/:displayedRoutes?'}
          component={RouteWrapper}
        />
        <Route
          path={'/configs/:configName'}
          component={Wrapper}
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
}

export default App;
