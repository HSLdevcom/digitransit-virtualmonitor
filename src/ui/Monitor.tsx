import React, { FC, useState, useEffect, useContext } from 'react';
import cx from 'classnames';
import { IView, IClosedStop, IMapSettings } from '../util/Interfaces';
import MonitorRowContainer from './MonitorRowContainer';
import { getLayout, getRouteCodeColumnWidth } from '../util/getResources';
import { IDeparture } from './MonitorRow';
import MonitorOverlay from './MonitorOverlay';
import MonitorTitlebar from './MonitorTitleBar';
import { ConfigContext, MonitorContext } from '../contexts';
import { stopsAndStationsFromViews } from '../util/monitorUtils';
import { getStopIcon } from '../util/stopCardUtil';
import MonitorMapContainer from '../MonitorMapContainer';

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
  mapSettings?: IMapSettings;
  mapLanguage?: string;
  mqttProps?: any;
  mapDepartures?: any;
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
  mapSettings,
  mapLanguage,
  mqttProps,
  mapDepartures,
}) => {
  const config = useContext(ConfigContext);
  const { cards } = useContext(MonitorContext);
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );
  const {
    isMultiDisplay,
    fontSizeDivider,
    tightenedFontSizeDivider,
    previewFontSize,
    tightenedPreviewFontSize,
    isPortrait,
  } = getLayout(view.layout);
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
  const fontSize =
    isPreview && isPortrait
      ? previewFontSize
      : (windowHeight * 0.7) / fontSizeDivider;
  const tightenedFontSize =
    isPreview && isPortrait
      ? tightenedPreviewFontSize
      : (windowHeight * 0.7) / tightenedFontSizeDivider;
  const calculatedColumnWidth = getRouteCodeColumnWidth(
    departures,
    view,
    fontSize,
    config,
  );
  // The width and height of a vehicle icon.
  // For clarity icon is a bit bigger than text, except on tightened views where it is adjusted to fit narrower lines.
  const iconWidthHeight = tightenedFontSizeDivider
    ? fontSize - 1
    : fontSize + 10;

  const style = {
    '--height': `${Number(windowHeight).toFixed(0)}px`,
    '--width': `${Number(windowWidth).toFixed(0)}px`,
    '--monitor-background-color':
      config.colors.monitorBackground || config.colors.primary,
    '--routecode-col-width': `${calculatedColumnWidth}px`,
    '--font-size': `${fontSize}px`,
    '--tightened-font-size': `${tightenedFontSize}px`,
    '--icon-size': fontSize ? `${iconWidthHeight}px` : '5vh',
    '--monitor-button-background-color': config.colors.monitorButtonBackground,
  } as React.CSSProperties;

  const isLandscapeByLayout = view.layout <= 11 || view.layout === 20;
  const showMapDisplay = view.type === 'map';
  const stopsAndStations = stopsAndStationsFromViews(cards);
  const stopsForMap = stopsAndStations
    .map(stops => {
      return stops.map(stop => {
        const coord: [number, number] = [stop?.lat, stop?.lon];
        const obj = {
          coords: coord,
          mode: getStopIcon(stop),
        };
        return obj;
      });
    })
    .flat();
  stopsForMap.forEach(c => {
    c.coords.flat();
  });
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
      {showMapDisplay || mapSettings?.hideTimeTable ? (
        <MonitorMapContainer
          preview={isPreview}
          mapSettings={mapSettings}
          mapDepartures={mapDepartures}
          lang={mapLanguage}
          mqttProps={mqttProps}
        />
      ) : (
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
      )}
    </div>
  );
};

export default Monitor;
