import React, { FC } from 'react';
import { IMonitorConfig, IView, IWeatherData } from '../util/Interfaces';
import Icon from './Icon';
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
  currentTime: number;
  showTitle?: boolean;
  weatherData?: IWeatherData;
}
const MonitorTitlebar: FC<IProps> = ({
  weatherData,
  currentTime,
  view,
  config,
  preview,
  isMultiDisplay = false,
  isLandscape = false,
  currentLang,
  showTitle = false,
}) => {
  let weatherIconString;
  let tempLabel;
  if (weatherData) {
    weatherIconString = 'weather'.concat(weatherData.iconId).toString();
    const temperature = weatherData.temperature;
    tempLabel = `${Math.round(temperature)}\u00B0C`; // Temperature with Celsius
  }
  return (
    <Titlebar isPreview={preview} isLandscape={isLandscape}>
      <Logo
        monitorConfig={config}
        isPreview={preview}
        isLandscape={isLandscape}
        forMonitor={true}
      />
      {!isMultiDisplay && showTitle && (
        <div className={cx('title-text', { preview: preview })}>
          {view.title[currentLang]}
        </div>
      )}
      {isMultiDisplay && showTitle && (
        <div className="multi-display-titles">
          <div className={cx('left-title', { preview: preview })}>
            {view.columns.left.title[currentLang]}
          </div>
          <div className={cx('right-title', { preview: preview })}>
            {view.columns.right.title[currentLang]}
          </div>
        </div>
      )}
      <div className={cx('weather-container', { preview: preview })}>
        <Icon img={weatherIconString} width={50} height={50} />
        <span className="temperature">{tempLabel}</span>
      </div>
      <TitlebarTime
        currentTime={currentTime}
        isPreview={preview}
        isLandscape={isLandscape}
      />
    </Titlebar>
  );
};

export default MonitorTitlebar;
