import React, { FC, useState, useEffect, useContext } from 'react';
import { ConfigContext } from '../index';
import { IView, IClosedStop, ITrainData } from '../util/Interfaces';
import Monitor from './Monitor';
import { IDeparture } from './MonitorRow';
import { ITranslation } from './TranslationContainer';
import MonitorAlertRow from './MonitorAlertRow';
import { getLayout } from '../util/getLayout';
import cx from 'classnames';
import uniqBy from 'lodash/uniqBy';
import { stopTimeAbsoluteDepartureTime } from '../util/monitorUtils';
import MonitorAlertRowStatic from './MonitorAlertRowStatic';

interface IProps {
  views: Array<IView>;
  languages: Array<string>;
  stationDepartures: Array<Array<Array<IDeparture>>>; // First array is for individual cards, next array for the two columns inside each card
  stopDepartures: Array<Array<Array<IDeparture>>>; // and the final one for the actual departures
  translations?: Array<ITranslation>;
  alerts: any;
  preview?: boolean;
  closedStopViews: Array<IClosedStop>;
  trainsWithTrack?: Array<ITrainData>;
  staticContentHash?: string;
  staticUrl?: string;
  staticViewTitle?: string;
}

const sortAndFilter = (departures, trainsWithTrack) => {
  const sortedAndFiltered = uniqBy(
    departures.sort(
      (stopTimeA, stopTimeB) =>
        stopTimeAbsoluteDepartureTime(stopTimeA) -
        stopTimeAbsoluteDepartureTime(stopTimeB),
    ),
    departure => departure.trip.gtfsId,
  );
  const sortedAndFilteredWithTrack = trainsWithTrack ? [] : sortedAndFiltered;
  if (sortedAndFiltered.length > 0 && trainsWithTrack) {
    sortedAndFiltered.forEach(sf => {
      const trackDataFound = trainsWithTrack.filter(
        tt =>
          (tt.lineId === sf.trip.route.shortName ||
            tt.trainNumber.toString() === sf.trip.route.shortName) &&
          tt.timeInSecs === sf.serviceDay + sf.scheduledDeparture,
      );
      if (trackDataFound.length === 0) {
        sortedAndFilteredWithTrack.push({ ...sf });
      } else {
        sortedAndFilteredWithTrack.push({
          ...sf,
          stop: {
            ...sf.stop,
            platformCode: trackDataFound[0].track,
          },
        });
      }
    });
  }
  return sortedAndFilteredWithTrack;
};

const CarouselContainer: FC<IProps> = ({
  views,
  stopDepartures,
  stationDepartures,
  languages,
  translations,
  alerts,
  preview = false,
  closedStopViews,
  trainsWithTrack,
  staticContentHash,
  staticUrl,
  staticViewTitle,
}) => {
  const len = views.length * languages.length * 2;
  const [current, setCurrent] = useState(0);
  const [alertState, setAlertState] = useState(0);
  const [language, setLanguage] = useState(0);

  const orientations = ['static', 'vertical', 'horizontal'];
  const config = useContext(ConfigContext);
  const [demoOrientation, setDemoOrientation] = useState(
    orientations.indexOf(config.alertOrientation),
  );
  useEffect(() => {
    const next = (current + 1) % len;
    const time =
      (views[Math.floor(current / 2) % views.length].duration * 1000) / 2;
    const id = setTimeout(() => {
      if ((next / 2) % views.length === 0) {
        const nextLan = (language + 1) % languages.length;
        setLanguage(nextLan);
      }
      setAlertState(current % 2);
      setCurrent(next);
    }, time);
    return () => clearTimeout(id);
  }, [current]);

  const index = Math.floor(current / 2) % views.length;

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
    ...views[index],
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

  const environment = process.env.NODE_ENV;
  const alertOrientation =
    environment && environment === 'production'
      ? config.alertOrientation
      : orientations[demoOrientation];

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
      translatedStrings={
        translations ? translations.filter(t => t.lang === lan) : []
      }
      isPreview={preview}
      alertState={alertState}
      alertComponent={alertComponent}
      alertRowSpan={alertSpan}
      closedStopViews={closedStopViews}
      staticContentHash={staticContentHash}
      staticUrl={staticUrl}
      staticViewTitle={staticViewTitle}
    />
  );
};

export default CarouselContainer;
