import React, { FC, useState, useEffect } from 'react';
import cx from 'classnames';
import { IView, IClosedStop } from '../util/Interfaces';
import { getWeatherData } from '../util/monitorUtils';
import { DateTime } from 'luxon';
import SunCalc from 'suncalc';
import Titlebar from './Titlebar';
import TitlebarTime from './TitlebarTime';
import Logo from './logo/Logo';
import MonitorRowContainer from './MonitorRowContainer';
import { getLayout } from '../util/getLayout';
import { IMonitorConfig } from '../App';
import { IDeparture } from './MonitorRow';
import { EpochMilliseconds } from '../time';
import { ITranslation } from './TranslationContainer';
import MonitorOverlay from './MonitorOverlay';
import MonitorTitlebar from './MonitorTitleBar';
import { getColorByName } from '../util/getConfig';
import { defaultFontNarrow, defaultFontNormal } from './DefaultStyles';

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

interface IProps {
  alertState: number;
  readonly view: IView;
  readonly departures: Array<Array<IDeparture>>;
  currentLang: string;
  readonly translatedStrings: Array<ITranslation>;
  readonly config: IMonitorConfig;
  readonly time?: EpochMilliseconds;
  readonly isPreview: boolean;
  alertComponent: any;
  alertRowSpan: number;
  closedStopViews: Array<IClosedStop>;
  error?: string;
  staticContentHash?: string;
  staticUrl?: string;
  staticViewTitle?: string;
}
let to;
const checkDayNight = (iconId, timem, lat, lon) => {
  const dayNightIconIds = [1, 2, 21, 22, 23, 41, 42, 43, 61, 62, 71, 72, 73];
  const date = timem;
  const dateMillis = timem.ts;
  const sunCalcTimes = SunCalc.getTimes(date, lat, lon);
  const sunrise = sunCalcTimes.sunrise.getTime();
  const sunset = sunCalcTimes.sunset.getTime();
  if (
    (sunrise > dateMillis || sunset < dateMillis) &&
    dayNightIconIds.includes(iconId)
  ) {
    // Night icon = iconId + 100
    return iconId + 100;
  }
  return iconId;
};
const Monitor: FC<IProps> = ({
  view,
  departures,
  translatedStrings,
  currentLang,
  config,
  time,
  isPreview,
  alertState,
  alertComponent,
  alertRowSpan,
  closedStopViews,
  error,
  staticContentHash,
  staticUrl,
  staticViewTitle,
}) => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );
  const [weatherFetched, setWeatherFetched] = useState(false);
  const [weatherData, setWeatherData] = useState();

  const { isMultiDisplay } = getLayout(view.layout);
  const [showOverlay, setShowOverlay] = useState(false);
  useEffect(() => {
    setWindowDimensions(getWindowDimensions());
    window.addEventListener('resize', () => {
      setWindowDimensions(getWindowDimensions());
    });
  }, []);

  const currentTime = time ? time : new Date().getTime();

  const windowHeight = windowDimensions.height;
  const windowWidth = windowDimensions.width;
  const style = {
    '--height': `${Number(windowHeight).toFixed(0)}px`,
    '--width': `${Number(windowWidth).toFixed(0)}px`,
    '--monitor-background-color':
      getColorByName('monitorBackground') || getColorByName('primary'),
    '--font-family': defaultFontNormal,
    '--font-family-narrow': defaultFontNarrow,
  } as React.CSSProperties;

  const coeff = 1000 * 60 * 5;
  const date = new Date(); //or use any other date
  const rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
  const isLandscapeByLayout = view.layout <= 11;
  const timem = DateTime.now();
  const from = view.columns.left.stops[0];
  const layout = getLayout(view.layout);
  const showWeather = !layout.isMultiDisplay && !layout.isPortrait
  if (!weatherFetched && from && showWeather) {
    getWeatherData(timem, from.lat, from.lon).then(res => {
      let weatherData;
      if (Array.isArray(res) && res.length === 3) {
        weatherData = {
          temperature: res[0].ParameterValue,
          windSpeed: res[1].ParameterValue,
          time,
          // Icon id's and descriptions: https://www.ilmatieteenlaitos.fi/latauspalvelun-pikaohje ->  Sääsymbolien selitykset ennusteissa.
          iconId: checkDayNight(
            res[2].ParameterValue,
            timem,
            from.lat,
            from.lon,
          ),
        };
      }
      setWeatherData(weatherData);
    });
    setWeatherFetched(true);
  }

  return (
    <div
      style={style}
      className={cx('main-content-container', {
        preview: isPreview,
        portrait: !isLandscapeByLayout,
      })}
      onMouseMove={() => {
        setShowOverlay(true);
        clearTimeout(to);
        to = setTimeout(() => setShowOverlay(false), 3000);
      }}
    >
      <MonitorOverlay
        show={showOverlay}
        isPreview={isPreview}
        staticUrl={staticUrl}
        staticViewTitle={staticViewTitle}
        staticContentHash={staticContentHash}
      />
      <MonitorTitlebar
        weatherData={weatherData}
        config={config}
        isMultiDisplay={isMultiDisplay}
        isLandscape={isLandscapeByLayout}
        preview={isPreview}
        view={view}
        currentLang={currentLang}
        currentTime={currentTime}
        showTitle
      />
      <MonitorRowContainer
        viewId={view['id']}
        departuresLeft={departures[0].filter(x => x != null)}
        departuresRight={departures[1].filter(x => x != null)}
        rightStops={view.columns.right.stops}
        leftStops={view.columns.left.stops}
        currentLang={currentLang}
        translatedStrings={translatedStrings}
        layout={view.layout}
        isLandscape={isLandscapeByLayout}
        alertState={alertState}
        alertComponent={alertComponent}
        alertRowSpan={alertRowSpan}
        showMinutes={Number(config.showMinutes)}
        closedStopViews={closedStopViews}
        error={error}
      />
    </div>
  );
};

export default Monitor;
