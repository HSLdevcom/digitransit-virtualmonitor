import React, { FC, useEffect, useState } from 'react';
import { IView } from '../util/Interfaces';
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
}

export interface ITranslation {
  trans_id: string;
  lang: string;
  translation: string;
}

const TranslationContainer: FC<IProps> = ({
  languages,
  translationIds,
  views,
  stationDepartures,
  stopDepartures,
  preview,
}) => {
  const [translations, setTranslations] = useState([]);
  useEffect(() => {
    if (translationIds.length > 0) {
      monitorAPI
        .getTranslations(translationIds)
        .then((t: Array<ITranslation>) => {
          setTranslations(t);
        });
    }
  }, []);
  return (
    <CarouselContainer
      languages={languages}
      views={views}
      translations={translations}
      stationDepartures={stationDepartures}
      stopDepartures={stopDepartures}
      isPreview={preview}
    />
  );
};

export default TranslationContainer;
