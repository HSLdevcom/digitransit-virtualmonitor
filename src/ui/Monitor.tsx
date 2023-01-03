import React, { FC, useState, useEffect, useContext } from 'react';
import cx from 'classnames';
import { IView, IClosedStop } from '../util/Interfaces';
import MonitorRowContainer from './MonitorRowContainer';
import { getLayout } from '../util/getLayout';
import { IDeparture } from './MonitorRow';
import MonitorOverlay from './MonitorOverlay';
import MonitorTitlebar from './MonitorTitleBar';
import { ConfigContext } from '../contexts';

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
  readonly isPreview: boolean;
  alertComponent: any;
  alertRowSpan: number;
  closedStopViews: Array<IClosedStop>;
}
let to;

const Monitor: FC<IProps> = ({
  view,
  departures,
  currentLang,
  isPreview,
  alertState,
  alertComponent,
  alertRowSpan,
  closedStopViews,
}) => {
  const config = useContext(ConfigContext);
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );
  const { isMultiDisplay } = getLayout(view.layout);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const setDimensions = () => {
      setWindowDimensions(getWindowDimensions());
    };
    window.addEventListener('resize', setDimensions);
    return () => window.removeEventListener('resize', setDimensions);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(to);
    };
  }, []);

  const windowHeight = windowDimensions.height;
  const windowWidth = windowDimensions.width;
  const style = {
    '--height': `${Number(windowHeight).toFixed(0)}px`,
    '--width': `${Number(windowWidth).toFixed(0)}px`,
    '--monitor-background-color':
      config.colors.monitorBackground || config.colors.primary,
  } as React.CSSProperties;

  const isLandscapeByLayout = view.layout <= 11;

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
      {!isPreview && <MonitorOverlay show={showOverlay} />}
      <MonitorTitlebar
        isMultiDisplay={isMultiDisplay}
        isLandscape={isLandscapeByLayout}
        preview={isPreview}
        view={view}
        currentLang={currentLang}
      />
      <MonitorRowContainer
        viewId={view['id']}
        departuresLeft={departures[0].filter(x => x != null)}
        departuresRight={departures[1].filter(x => x != null)}
        rightStops={view.columns.right.stops}
        leftStops={view.columns.left.stops}
        currentLang={currentLang}
        layout={view.layout}
        isLandscape={isLandscapeByLayout}
        alertState={alertState}
        alertComponent={alertComponent}
        alertRowSpan={alertRowSpan}
        showMinutes={Number(config.showMinutes)}
        closedStopViews={closedStopViews}
        preview={isPreview}
      />
    </div>
  );
};

export default Monitor;
