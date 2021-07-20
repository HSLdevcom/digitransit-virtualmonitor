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
  const len = views.length;
  const [current, setCurrent] = useState(0);
  const [language, setLanguage] = useState(0);
  useEffect(() => {
    const next = (current + 1) % len;
    const time = views[current].duration * 1000;
    const id = setTimeout(() => setCurrent(next), time);
    return () => clearTimeout(id);
  }, [current]);

  useEffect(() => {
    const next = (language + 1) % languages.length;
    const timeout = setTimeout(() => setLanguage(next), 3000)
    return () => clearTimeout(timeout);
  }, [language])
  const config = getConfig();
  const departures = 
    [
      [...stationDepartures[current][0], ...stopDepartures[current][0]],
      [...stationDepartures[current][1], ...stopDepartures[current][1]]
    ];
  return (
    <Monitor
      view={views[current]}
      departures={departures}
      translatedStrings={translations.filter(t => t.lang !== languages[language])}
      config={config}
      noPolling={noPolling}
      time={time}
      isPreview={isPreview}
    />
  );
};

export default CarouselContainer;
