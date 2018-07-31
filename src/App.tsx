import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import 'src/App.css';
import HslLogo from 'src/ui/HslLogo';
import VirtualMonitor from 'src/ui/VirtualMonitor'
import StopSelectorSwitch from './ui/StopSelectorSwitch';

const RouteWrapper = ({ match }: any) => (
  <VirtualMonitor
    stops={[match.params.stopId]}
    displayedRoutes={match.params.displayedRoutes}
    // title={'Jokupysäkki'}
  />
);

class App extends React.Component {
  public render() {
    return (
      <Switch>
        <Route
          path={'/stop/:stopId/:displayedRoutes?'}
          component={RouteWrapper}
        />
        <Route>
          <div>
            <HslLogo />
            Anna pysäkki parametrina.
            <StopSelectorSwitch />
          </div>
        </Route>
      </Switch>
    );
  }
}

export default App;
