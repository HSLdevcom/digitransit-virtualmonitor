import React, { FC, useState, useEffect } from 'react';
import cx from 'classnames';
import { IView, IClosedStop } from '../util/Interfaces';
import Titlebar from './Titlebar';
import TitlebarTime from './TitlebarTime';
import Logo from './logo/Logo';
import MonitorRowContainer from './MonitorRowContainer';
import { getLayout } from '../util/getLayout';
import { IMonitorConfig } from '../App';
import { IDeparture } from './MonitorRow';
import { EpochMilliseconds } from '../time';
import { ITranslation } from './TranslationContainer';
import MonitorTitlebar from './MonitorTitleBar';

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
}
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
}) => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );
  const { isMultiDisplay } = getLayout(view.layout);

  useEffect(() => {
    setWindowDimensions(getWindowDimensions());
    window.addEventListener('resize', () => {
      setWindowDimensions(getWindowDimensions());
    });
  }, []);

  const currentTime = time ? time : new Date().getTime();

  const windowHeight = windowDimensions.height;
  const windowWidth = windowDimensions.width;
  const dimensions = {
    '--height': `${Number(windowHeight).toFixed(0)}px`,
    '--width': `${Number(windowWidth).toFixed(0)}px`,
  } as React.CSSProperties;

  const isLandscapeByLayout = view.layout <= 11;

  return (
    <div
      style={dimensions}
      className={cx('main-content-container', {
        preview: isPreview,
        portrait: !isLandscapeByLayout,
      })}
    >
      <MonitorTitlebar
        config={config}
        isMultiDisplay={isMultiDisplay}
        isLandscape={isLandscapeByLayout}
        preview={isPreview}
        view={view}
        currentLang={currentLang}
        currentTime={currentTime}
      />
      <MonitorRowContainer
        viewId={view['id']}
        departuresLeft={departures[0]}
        departuresRight={departures[1]}
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
      />
    </div>
  );
};

export default Monitor;
