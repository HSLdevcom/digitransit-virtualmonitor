import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';

import Logo from 'src/ui/logo/Logo';
import StopSelectorSwitch from 'src/ui/StopSelectorSwitch';
import Titlebar from 'src/ui/Titlebar';

import ConfigurationDisplay from 'src/ui/ConfigurationDisplay';
import ConfigurationList from 'src/ui/ConfigurationList';
import DisplayEditor from 'src/ui/DisplayEditor';
import DisplayUrlCompression from 'src/ui/DisplayUrlCompression';
import HelpPage from 'src/ui/HelpPage';
import QuickDisplay from 'src/ui/QuickDisplay';
import TitlebarTime from 'src/ui/TitlebarTime';
import StopTimesView from 'src/ui/Views/StopTimesView';

import 'src/App.css';

export interface IMonitorConfig {
  feedId?:  string,
  uri?: string,
      // Texts for Help page
  urlParamUsageText?: string,
  urlMultipleStopsText?: string,
  urlParamFindText?: string,
  urlParamFindAltText?: string,
};

export interface IConfigurationProps {
  monitorConfig?: IMonitorConfig,
};

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

export type combinedConfigurationAndInjected = IConfigurationProps & WithTranslation

class App extends React.Component<combinedConfigurationAndInjected> {
  constructor(props: combinedConfigurationAndInjected) {
    super(props);
  }
  public render() {
    const monitorConfig = this.props.monitorConfig;

    let helpPageUrlParamText: string = '';
    let helpPageurlMultipleStopsText: string = '';
    let helpPageUrlParamFindText: string = '';
    let helpPageUrlParamFindAltText: string = '';

    if(monitorConfig) {
     // set texts for help page.
      helpPageUrlParamText = monitorConfig.urlParamUsageText ? monitorConfig.urlParamUsageText : '';
      helpPageurlMultipleStopsText = monitorConfig.urlMultipleStopsText ? monitorConfig.urlMultipleStopsText : '';
      helpPageUrlParamFindText = monitorConfig.urlParamFindText ? monitorConfig.urlParamFindText : '';
      helpPageUrlParamFindAltText = monitorConfig.urlParamFindAltText ? monitorConfig.urlParamFindAltText : '';
    }

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
           component={({ match: { params: { }} }: RouteComponentProps<IMonitorConfig>) => (
            <HelpPage urlParamUsageText={helpPageUrlParamText}
                      urlMultipleStopsText={helpPageurlMultipleStopsText}
                      urlParamFindText={helpPageUrlParamFindText}
                      urlParamFindAltText={helpPageUrlParamFindAltText}
             />
            )}
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
                monitorConfig={monitorConfig}
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
                <Logo monitorConfig={monitorConfig} />
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

export default withTranslation('translations')(App);
