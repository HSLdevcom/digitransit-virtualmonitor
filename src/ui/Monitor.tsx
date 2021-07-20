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

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

interface IProps {
  readonly view: IView;
  readonly departures: Array<any>;
  readonly translatedStrings: Array<any>;
  readonly config: IMonitorConfig;
  readonly noPolling?: boolean;
  readonly time?: EpochMilliseconds;
  readonly isPreview: boolean;
}
const Monitor: FC<IProps> = ({
  view,
  departures,
  translatedStrings,
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

  let forcedLayout = undefined;

  let windowHeight = windowDimensions.height;
  let windowWidth = windowDimensions.width;

  if (!isPreview && windowWidth >= windowHeight && view.layout > 11) {
    forcedLayout = 'portrait';
    windowWidth = windowHeight / 1.775;
  }
  if (!isPreview && windowHeight >= windowWidth && view.layout <= 11) {
    forcedLayout = 'landscape';
    windowHeight = windowWidth / 1.775;
  }
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
        forcedLayout && forcedLayout === 'landscape' ? 'forced-landscape' : '',
        forcedLayout && forcedLayout === 'portrait' ? 'forced-portrait' : '',
      )}
    >
      <Titlebar
        isPreview={isPreview}
        isLandscape={isLandscapeByLayout}
        forcedLayout={forcedLayout}
      >
        <Logo
          monitorConfig={config}
          isPreview={isPreview}
          isLandscape={isLandscapeByLayout}
          forcedLayout={forcedLayout}
        />
        {!isMultiDisplay && (
          <div className={cx('title-text', isPreview ? 'preview' : '')}>
            {view.title['fi']}
          </div>
        )}
        {isMultiDisplay && (
          <div className="multi-display-titles">
            <div className="left-title">{view.columns.left.title['fi']}</div>
            <div className="right-title">{view.columns.right.title['fi']}</div>
          </div>
        )}
        <TitlebarTime
          currentTime={currentTime}
          updateInterval={noPolling ? 0 : 20000}
          isPreview={isPreview}
          isLandscape={isLandscapeByLayout}
          forcedLayout={forcedLayout}
        />
      </Titlebar>
      <MonitorRowContainer
        departuresLeft={departures[0]}
        departuresRight={departures[1]}
        translatedStrings={translatedStrings}
        layout={getLayout(view.layout)}
        isPreview={isPreview}
        isLandscape={isLandscapeByLayout}
        forcedLayout={forcedLayout}
      />
    </div>
  );
};

export default Monitor;
