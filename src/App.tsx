import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import 'src/App.css';
import AutoMoment from 'src/ui/AutoMoment';
import HslLogo from 'src/ui/HslLogo';
import StopSelectorSwitch from 'src/ui/StopSelectorSwitch';
import Titlebar from 'src/ui/Titlebar';

import ConfigurationDisplay from 'src/ui/ConfigurationDisplay';
import ConfigurationList from 'src/ui/ConfigurationList';
import DisplayUrlCompression from 'src/DisplayUrlCompression';
import StopTimesView from 'src/ui/Views/StopTimesView';

class App extends React.Component {
  public render() {
    return (
      <Switch>
        <Route
          path={'/urld/:version/:packedDisplay'}
          component={({ match: { params: { version, packedDisplay }} }: any) => (
            <DisplayUrlCompression
              version={decodeURIComponent(version)}
              packedString={decodeURIComponent(packedDisplay)}
            />
          )}
        />
        <Route
          path={'/configuration/:configuration/display/:display'}
          component={({ match: { params: { configuration, displayName }}}: any) => (
            <ConfigurationDisplay
              configurationName={configuration}
              displayName={displayName}
            />
          )}
        />
        <Route
          path={'/stop/:stopId/:displayedRoutes?'}
          component={({ match: { params: { stopId, displayedRoutes }} }: any) => (
            <StopTimesView
              stops={[stopId]}
              displayedRoutes={displayedRoutes}
            />
          )}
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
              {/* <div>
                Jaajaa
                <Packer
                  packer={packDisplay('v1', Object.values(conf['kamppi'].displays)[0])}
                >
                    {(packed) => packed
                      ? (
                        <div>
                            Packed string: {packed}
                        </div>
                      )
                      : (<div>Still packing...</div>)
                    }
                </Packer>
              </div> */}
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
