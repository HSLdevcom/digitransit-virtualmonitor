import React, { FC, useState, useEffect } from 'react';
import { getConfig } from '../util/getConfig';
import { IView } from '../util/Interfaces';
import Monitor from './Monitor';
import { EpochMilliseconds } from '../time';
import { IDeparture } from './MonitorRow';
import { ITranslation } from './TranslationContainer';
import MonitorAlertRow from './MonitorAlertRow';
import { getAlertRowSpanForLayouts, getLayout } from '../util/getLayout';

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
  const [current, setCurrent] = useState(0);
  const [alertState, setAlertState] = useState(0);
  const [language, setLanguage] = useState(0);
  const [alert, setAlert] = useState(0);
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

  useEffect(() => {
    const len = alerts.length * languages.length;
    const next = (alert + 1) % len;
    const to = setTimeout(() => {
      setAlert(next);
    }, 20000);
    return () => clearTimeout(to);
  }, [alert, alerts, languages]);

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
    //layout: 12,
  };
  const a = alerts[
    Math.floor(alert / languages.length)
  ]?.alertDescriptionTextTranslations.find(
    a => a.language === languages[alert % languages.length],
  ).text
  const {alertSpan} = getLayout(newView.layout);
  let alertComponent;
  if (a) {
    alertComponent = (
      <MonitorAlertRow
        alert={a}
        alertRows={1}
        alertCount={alerts.length * languages.length}
        currentLang={languages[language]}
        isLandscape={false}
      />
    );
  }

  return (
    <Monitor
      view={newView}
      currentLang={languages[language]}
      departures={departures}
      translatedStrings={translations.filter(t => t.lang === lan)}
      config={config}
      noPolling={noPolling}
      time={time}
      isPreview={preview}
      alertState={alertState}
      alertComponent={alertComponent}
      alertRowSpan={alertSpan}
    />
  );
};

export default CarouselContainer;
