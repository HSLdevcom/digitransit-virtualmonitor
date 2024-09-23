import React, { FC, useState, useEffect, useContext, useRef } from 'react';
import { ConfigContext, MonitorContext } from '../contexts';
import { IClosedStop, ITrainData } from '../util/Interfaces';
import Monitor from './Monitor';
import { IDeparture } from './MonitorRow';
import MonitorAlertRow from './MonitorAlertRow';
import { getLayout } from '../util/getResources';
import cx from 'classnames';
import { sortAndFilter } from '../util/monitorUtils';
import MonitorAlertRowStatic from './MonitorAlertRowStatic';

interface IProps {
  stationDepartures: Array<Array<Array<IDeparture>>>; // First array is for individual cards, next array for the two columns inside each card
  stopDepartures: Array<Array<Array<IDeparture>>>; // and the final one for the actual departures
  alerts: any;
  preview?: boolean;
  closedStopViews: Array<IClosedStop>;
  trainsWithTrack?: Array<ITrainData>;
  topics: any;
  messages: any;
  clientRef: any;
  topicRef: any;
  vehicleMarkerState?: any;
  setVehicleMarkerState?: any;
}

const CarouselContainer: FC<IProps> = ({
  stopDepartures,
  stationDepartures,
  alerts,
  preview = false,
  closedStopViews,
  trainsWithTrack,
  topics,
  messages,
  clientRef,
  topicRef,
  vehicleMarkerState,
  setVehicleMarkerState,
}) => {
  const { cards: views, languages, mapSettings } = useContext(MonitorContext);
  const mapLanguage = languages.length === 1 ? languages[0] : 'fi';
  const hideTimeTable = mapSettings?.hideTimeTable;
  const finalViews = hideTimeTable
    ? views.filter(view => view.type === 'map')
    : views;
  const len = finalViews.length * languages.length * 2;
  const [current, setCurrent] = useState(0);
  const [alertState, setAlertState] = useState(0);
  const [language, setLanguage] = useState(0);
  const orientations = ['static', 'vertical', 'horizontal'];
  const config = useContext(ConfigContext);
  const [demoOrientation, setDemoOrientation] = useState(
    orientations.indexOf(config.alertOrientation),
  );
  const environment = process.env.NODE_ENV;
  const [alertOrientation, setAlertOrientation] = useState(
    environment && environment === 'production'
      ? config.alertOrientation
      : orientations[demoOrientation],
  );

  useEffect(() => {
    const next = (current + 1) % len;
    const time =
      (finalViews[Math.floor(current / 2) % finalViews.length].duration *
        1000) /
      2;
    const id = setTimeout(() => {
      if ((next / 2) % finalViews.length === 0) {
        const nextLan = (language + 1) % languages.length;
        setLanguage(nextLan);
      }

      setAlertState(current % 2);

      setCurrent(next);
    }, time);
    return () => clearTimeout(id);
  }, [current]);

  const index = Math.floor(current / 2) % finalViews.length;

  const departures = [
    sortAndFilter(
      [...stationDepartures[index][0], ...stopDepartures[index][0]],
      trainsWithTrack,
    ),
    sortAndFilter(
      [...stationDepartures[index][1], ...stopDepartures[index][1]],
      trainsWithTrack,
    ),
  ];
  const lan = languages[language] === 'en' ? 'fi' : languages[language];
  // for easy testing of different layouts
  const newView = {
    ...finalViews[index],
    //layout: 8,
  };
  const { alertSpan } = getLayout(newView.layout);
  let alertComponent;
  let alertRowClass = '';
  switch (alertSpan) {
    case 2:
      alertRowClass = 'two-rows';
      break;
    case 3:
      alertRowClass = 'three-rows';
      break;
    case 4:
      alertRowClass = 'four-rows';
      break;
    default:
      alertRowClass = '';
      break;
  }

  const alertRowReference = useRef();
  useIsOverflow(alertRowReference, isOverflowFromCallback => {
    if (isOverflowFromCallback) {
      setAlertOrientation('horizontal');
    }
  });

  if (alerts.length > 0) {
    alertComponent = (
      <div
        className={cx(
          'row-with-separator alert',
          alertOrientation,
          alertRowClass,
        )}
      >
        <span
          className="demo-button"
          onClick={() => {
            const next = (demoOrientation + 1) % 3;
            setDemoOrientation(next);
          }}
        ></span>
        <div className="separator"></div>
        {alertOrientation === 'static' ? (
          <MonitorAlertRowStatic
            alerts={alerts}
            languages={languages}
            preview={preview}
            alertRowReference={alertRowReference}
          />
        ) : (
          <MonitorAlertRow
            alertOrientation={alertOrientation}
            alerts={alerts}
            languages={languages}
            preview={preview}
          />
        )}
      </div>
    );
  }

  return (
    <Monitor
      view={newView}
      currentLang={languages[language]}
      departures={departures}
      isPreview={preview}
      alertState={alertState}
      alertComponent={alertComponent}
      alertRowSpan={alertSpan}
      closedStopViews={closedStopViews}
      mapSettings={mapSettings}
      topics={topics}
      mapLanguage={mapLanguage}
      messages={messages}
      clientRef={clientRef}
      topicRef={topicRef}
      vehicleMarkerState={vehicleMarkerState}
      setVehicleMarkerState={setVehicleMarkerState}
    />
  );
};

export const useIsOverflow = (ref, callback) => {
  useEffect(() => {
    const { current } = ref;
    if (current) {
      callback(current.scrollHeight > current.clientHeight);
    }
  }, [callback, ref]);
};

export default CarouselContainer;
