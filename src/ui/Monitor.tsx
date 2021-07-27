import React, { FC, useState, useEffect } from 'react';
import cx from 'classnames';
import { IView } from '../util/Interfaces';
import Titlebar from './Titlebar';
import TitlebarTime from './TitlebarTime';
import Logo from './logo/Logo';
import MonitorRowContainer from './MonitorRowContainer';
import { getLayout } from '../util/getLayout';
import { IMonitorConfig } from '../App';
import { IDeparture } from './MonitorRow';
import { getCurrentSeconds, EpochMilliseconds } from '../time';
import { ITranslation } from './TranslationContainer';

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

interface IProps {
  readonly view: IView;
  readonly departures: Array<Array<IDeparture>>;
  currentLang: string;
  readonly translatedStrings: Array<ITranslation>;
  readonly config: IMonitorConfig;
  readonly noPolling?: boolean;
  readonly time?: EpochMilliseconds;
  readonly isPreview: boolean;
}
const Monitor: FC<IProps> = ({
  view,
  departures,
  translatedStrings,
  currentLang,
  config,
  noPolling,
  time,
  isPreview,
}) => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );
  const isMultiDisplay = getLayout(view.layout)[2];

  useEffect(() => {
    setWindowDimensions(getWindowDimensions());
  }, []);

  const currentTime = time ? time : new Date().getTime();

  let windowHeight = windowDimensions.height;
  let windowWidth = windowDimensions.width;

  const dimensions = {
    '--height': `${Number(windowHeight).toFixed(0)}px`,
    '--width': `${Number(windowWidth).toFixed(0)}px`,
  } as React.CSSProperties;

  const isLandscapeByLayout = view.layout <= 11;

  return (
    <div
      style={dimensions}
      className={cx(
        'main-content-container',
        isPreview ? 'preview' : 'full',
        isLandscapeByLayout ? '' : 'portrait',
      )}
    >
      <Titlebar isPreview={isPreview} isLandscape={isLandscapeByLayout}>
        <Logo
          monitorConfig={config}
          isPreview={isPreview}
          isLandscape={isLandscapeByLayout}
        />
        {!isMultiDisplay && (
          <div className={cx('title-text', isPreview ? 'preview' : '')}>
            {view.title[currentLang]}
          </div>
        )}
        {isMultiDisplay && (
          <div className="multi-display-titles">
            <div className="left-title">
              {view.columns.left.title[currentLang]}
            </div>
            <div className="right-title">
              {view.columns.right.title[currentLang]}
            </div>
          </div>
        )}
        <TitlebarTime
          currentTime={currentTime}
          updateInterval={noPolling ? 0 : 20000}
          isPreview={isPreview}
          isLandscape={isLandscapeByLayout}
        />
      </Titlebar>
      <MonitorRowContainer
        departuresLeft={departures[0]}
        departuresRight={departures[1]}
        currentLang={currentLang}
        translatedStrings={translatedStrings}
        layout={getLayout(view.layout)}
        isLandscape={isLandscapeByLayout}
      />
    </div>
  );
};

export default Monitor;
