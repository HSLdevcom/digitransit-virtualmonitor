import React, { FC, useState, useEffect } from 'react';
import { getConfig } from '../util/getConfig';
import { IView } from '../util/Interfaces';
import Monitor from './Monitor';
import { EpochMilliseconds } from '../time';
import { IDeparture } from './MonitorRow';
import { ITranslation } from './TranslationContainer';

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
  const len = views.length * languages.length;
  const [current, setCurrent] = useState(0);
  const [language, setLanguage] = useState(0);
  const [alert, setAlert] = useState(0);
  useEffect(() => {
    const next = (current + 1) % len;
    const time = views[current % views.length].duration * 1000;
    const id = setTimeout(() => {
      if (next % views.length === 0) {
        const nextLan = (language + 1) % languages.length;
        setLanguage(nextLan);
      }
      if (next % len === 0) {
        setAlert(alert + 1);
      }
      console.log(next, len);
      setCurrent(next);
    }, time);
    return () => clearTimeout(id);
  }, [current]);
  const index = current % views.length;
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
  return (
    <Monitor
      view={newView}
      currentLang={languages[language]}
      departures={departures}
      translatedStrings={translations.filter(t => t.lang === lan)}
      config={config}
      alert={alert}
      noPolling={noPolling}
      time={time}
      isPreview={preview}
    />
  );
};

export default CarouselContainer;
