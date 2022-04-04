import React, { FC, useEffect, useState } from 'react';
import { IMonitorConfig, IView } from '../util/Interfaces';
import { DateTime } from 'luxon';
import Icon, { iconExists } from './Icon';
import { getWeatherData, checkDayNight } from '../util/monitorUtils';
import Logo from './logo/Logo';
import Titlebar from './Titlebar';
import TitlebarTime from './TitlebarTime';
import cx from 'classnames';

interface IProps {
  config: IMonitorConfig;
  preview: boolean;
  isMultiDisplay?: boolean;
  isLandscape?: boolean;
  view: IView;
  currentLang: string;
}

const MonitorTitlebar: FC<IProps> = ({
  view,
  config,
  preview,
  isMultiDisplay = false,
  isLandscape = false,
  currentLang,
}) => {
  const location = view.columns.left.stops[0];
  const showWeather =
    !isMultiDisplay && isLandscape && location?.lat && location?.lon;

  let temperature;
  let weatherIconString;
  let weatherIconExists = false;

  const [weatherFetched, setWeatherFetched] = useState(false);
  const [weatherData, setWeatherData]: any = useState({});
  // update weather data in 15 minutes interval

  const fetchWeather = () => {
    getWeatherData(DateTime.now(), location.lat, location.lon).then(res => {
      let weatherData;
      if (Array.isArray(res) && res.length === 3) {
        weatherData = {
          temperature: res[0].ParameterValue,
          windSpeed: res[1].ParameterValue,
          time: DateTime.now(),
          // Icon id's and descriptions: https://www.ilmatieteenlaitos.fi/latauspalvelun-pikaohje ->  Sääsymbolien selitykset ennusteissa.
          iconId: checkDayNight(
            res[2].ParameterValue,
            DateTime.now(),
            location.lat,
            location.lon,
          ),
        };
      }
      setWeatherData(weatherData);
      setWeatherFetched(true);
    });
  };
  useEffect(() => {
    fetchWeather();
    const intervalId = setInterval(() => {
      fetchWeather();
      setWeatherFetched(false);
    }, 1000 * 60 * 15); // in milliseconds
    return () => clearInterval(intervalId);
  }, []);

  if (weatherData && weatherFetched) {
    weatherIconString = 'weather'.concat(weatherData?.iconId).toString();
    weatherIconExists = iconExists(weatherIconString);
    temperature = `${Math.round(weatherData?.temperature)}\u00B0C`; // Temperature with Celsius
  }

  return (
    <Titlebar
      isPreview={preview}
      isLandscape={isLandscape}
      isMultiDisplay={isMultiDisplay}
    >
      <Logo
        monitorConfig={config}
        isPreview={preview}
        isLandscape={isLandscape}
        forMonitor={true}
      />
      {!isMultiDisplay && (
        <div
          className={cx('title-text', {
            preview: preview,
            portrait: !isLandscape,
          })}
        >
          {view.title[currentLang]}
        </div>
      )}
      {isMultiDisplay && (
        <div className="multi-display-titles">
          <div className={cx('left-title', { preview: preview })}>
            {view.columns.left.title[currentLang]}
          </div>
          <div className={cx('right-title', { preview: preview })}>
            {view.columns.right.title[currentLang]}
          </div>
        </div>
      )}
      {!weatherData && showWeather && (
        <div
          className={cx('weather-container', {
            preview: preview,
            onlyTemperature: !weatherIconExists,
          })}
        ></div>
      )}
      {weatherData && showWeather && (
        <div
          className={cx('weather-container', {
            preview: preview,
            onlyTemperature: !weatherIconExists,
          })}
        >
          {weatherIconExists && (
            <div className="icon-container">
              <Icon img={weatherIconString} width={10} height={10} />
            </div>
          )}
          <div className="temperature-container">
            <span>{temperature}</span>
          </div>
        </div>
      )}
      <TitlebarTime isPreview={preview} isLandscape={isLandscape} />
    </Titlebar>
  );
};

export default MonitorTitlebar;
