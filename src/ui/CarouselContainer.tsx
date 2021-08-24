import React, { FC, useState, useEffect } from 'react';
import { getConfig } from '../util/getConfig';
import { IView } from '../util/Interfaces';
import Monitor from './Monitor';
import { EpochMilliseconds } from '../time';
import { IDeparture } from './MonitorRow';
import { ITranslation } from './TranslationContainer';
import MonitorAlertRow from './MonitorAlertRow';
import { getLayout } from '../util/getLayout';
import cx from 'classnames';

interface IProps {
  views: Array<IView>;
  languages: Array<string>;
  stationDepartures: Array<Array<Array<IDeparture>>>; // First array is for individual cards, next array for the two columns inside each card
  stopDepartures: Array<Array<Array<IDeparture>>>; // and the final one for the actual departures
  translations?: Array<ITranslation>;
  alerts: any;
  noPolling?: boolean;
  time?: EpochMilliseconds;
  preview?: boolean;
}

const CarouselContainer: FC<IProps> = ({
  views,
  stopDepartures,
  stationDepartures,
  languages,
  translations,
  noPolling,
  alerts,
  time,
  preview = false,
}) => {
  const len = views.length * languages.length * 2;
  const alertsLength = alerts.length * languages.length;
  const [current, setCurrent] = useState(0);
  const [alertState, setAlertState] = useState(0);
  const [language, setLanguage] = useState(0);
  //const [alert, setAlert] = useState(0);

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

  // useEffect(() => {
  //   console.log("useEff", alert)
  //   // const len = alerts.length * languages.length;
  //   // const next = (alert + 1) % len;
  //   // const to = setTimeout(() => {
  //   //   setAlert(next);
  //   // }, 19000);
  //   // return () => clearTimeout(to);
  // }, [alert, alerts, languages]);

  const index = Math.floor(current / 2) % views.length;
  const config = getConfig();
  const departures = [
    [...stationDepartures[index][0], ...stopDepartures[index][0]],
    [...stationDepartures[index][1], ...stopDepartures[index][1]],
  ];
  const lan = languages[language] === 'en' ? 'fi' : languages[language];
  // for easy testing of different layouts
  const newView = {
    ...views[index],
    //layout: 13,
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
  if (alerts.length > 0) {
    alertComponent = (
      <div className={cx('row-with-separator alert', alertRowClass)}>
        <div className="separator"></div>
        <MonitorAlertRow
          alerts={alerts}
          languages={languages}
        />
      </div>
    );
  }

  return (
    <Monitor
      view={newView}
      currentLang={languages[language]}
      departures={departures}
      translatedStrings={translations.filter(t => t.lang === lan)}
      config={config}
      time={time}
      isPreview={preview}
      alertState={alertState}
      alertComponent={alertComponent}
      alertRowSpan={alertSpan}
    />
  );
};

export default CarouselContainer;
