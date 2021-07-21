import React, { FC, useState, useEffect } from 'react';
import { getConfig } from '../util/getConfig';
import { IView } from '../util/Interfaces';
import Monitor from './Monitor';
import { EpochMilliseconds } from '../time';

interface IProps {
  views: Array<IView>;
  languages: Array<string>;
  stopDepartures?: Array<any>;
  stationDepartures?: Array<any>;
  translations?: Array<any>;
  noPolling?: boolean;
  time?: EpochMilliseconds;
  isPreview?: boolean;
}

const CarouselContainer: FC<IProps> = ({
  views,
  stopDepartures,
  stationDepartures,
  languages,
  translations,
  noPolling,
  time,
  isPreview = false,
}) => {
  const len = views.length * languages.length;
  const [current, setCurrent] = useState(0);
  const [language, setLanguage] = useState(0);
  useEffect(() => {
    const next = (current + 1) % len;
    const time = views[current % views.length].duration * 1000;
    const id = setTimeout(() => {
      if (next % views.length === 0) {
        const nextLan = (language + 1) % languages.length;
        setLanguage(nextLan);
      }
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
  return (
    <Monitor
      view={views[index]}
      currentLang={languages[language]}
      departures={departures}
      translatedStrings={translations.filter(t => t.lang === lan)}
      config={config}
      noPolling={noPolling}
      time={time}
      isPreview={isPreview}
    />
  );
};

export default CarouselContainer;
