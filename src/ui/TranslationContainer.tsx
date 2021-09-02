import React, { FC, useEffect, useState } from 'react';
import { IAlert, IView, IClosedStop } from '../util/Interfaces';
import CarouselContainer from './CarouselContainer';
import monitorAPI from '../api';
import { IDeparture } from './MonitorRow';

interface IProps {
  views: Array<IView>;
  preview?: boolean;
  languages: Array<string>;
  translationIds: Array<string>;
  stationDepartures: Array<Array<Array<IDeparture>>>;
  stopDepartures: Array<Array<Array<IDeparture>>>;
  alerts: Array<Array<IAlert>>;
  closedStopViews: Array<IClosedStop>;
  error?: string;
}

export interface ITranslation {
  trans_id: string;
  lang: string;
  translation: string;
}

const TranslationContainer: FC<IProps> = ({
  languages,
  translationIds,
  ...rest
}) => {
  const getTranslations = () => {
    return monitorAPI
      .getTranslations(translationIds)
      .then((t: Array<ITranslation>) => {
        setTranslations(t);
      });
  };
  const [translations, setTranslations] = useState([]);
  const [initialFetch, setInitialFetch] = useState(false);
  const onceADay = 60 * 60 * 24 * 1000;
  if (!initialFetch) {
    getTranslations();
    setInitialFetch(true);
  }
  useEffect(() => {
    if (translationIds.length > 0) {
      const intervalId = setInterval(() => {
        getTranslations();
      }, onceADay);
      return () => clearInterval(intervalId); //This is important
    }
  }, []);
  return (
    <CarouselContainer
      languages={languages}
      translations={translations}
      {...rest}
    />
  );
};

export default TranslationContainer;
