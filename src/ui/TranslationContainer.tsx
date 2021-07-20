import React, { FC, useEffect, useState } from 'react';
import { IView } from '../util/Interfaces';
import CarouselContainer from './CarouselContainer';
import monitorAPI from '../api';

interface IProps {
  views: Array<IView>;
  languages: Array<string>;
  translationIds: any;
  stationDepartures: any;
  stopDepartures: any;
}

const TranslationContainer : FC<IProps> = ({languages, translationIds, views, stationDepartures, stopDepartures}) => {
  const [translations, setTranslations] = useState([]);
  useEffect(() => {
    if (translationIds.length > 0) {
      const ids = translationIds.map(s => s?.split(':')[1])
      console.log(ids)
      monitorAPI.getTranslations(translationIds).then((t:Array<any>) => {
        setTranslations(t)
      })
    }
  }, []);
  return <CarouselContainer languages={languages} views={views} translations={translations}stationDepartures={stationDepartures} stopDepartures={stopDepartures} />
}

export default TranslationContainer;