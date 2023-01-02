import React, { FC } from 'react';
import { IAlert, IClosedStop } from '../util/Interfaces';
import CarouselContainer from './CarouselContainer';
import { IDeparture } from './MonitorRow';
import { useQuery } from '@apollo/client';
import {
  GetTransLationsForStationDeparturesDocument,
  GetTranslationsForStopDeparturesDocument,
} from '../generated';
import { getDepartureDestination } from '../util/monitorUtils';
interface IProps {
  preview?: boolean;
  stopIds: Array<string>;
  stationIds: Array<string>;
  stationDepartures: Array<Array<Array<IDeparture>>>;
  stopDepartures: Array<Array<Array<IDeparture>>>;
  alerts: Array<Array<IAlert>>;
  closedStopViews: Array<IClosedStop>;
  error?: string;
  trainsWithTrack?: any;
  languages: Array<Language>;
  pollInterval: number;
  largest: number;
}
const enum Language {
  fi = 'fi',
  sv = 'sv',
  en = 'en',
}
export interface ITranslation {
  id: string;
  fi?: string;
  sv?: string;
}
const getTranslations = (stops, lang, departureTranslations) => {
  stops.forEach(stop => {
    stop.stoptimesForPatterns.forEach(stoptime =>
      stoptime.stoptimes.forEach(departure => {
        const departureDestination = getDepartureDestination(departure);
        const translation = departureTranslations.find(
          item => item.id === departure.trip.gtfsId,
        );
        if (translation) {
          translation[lang] = departureDestination; //time.trip.tripHeadsign;
        } else {
          departureTranslations.push({
            id: departure.trip.gtfsId,
            [lang]: departureDestination, //time.trip.tripHeadsign,
          });
        }
      }),
    );
  });
};
const TranslationContainer: FC<IProps> = ({
  stopIds,
  stationIds,
  languages,
  pollInterval,
  largest,
  ...rest
}) => {
  const departureTranslations = [];
  languages.forEach(lang => {
    const stopTranslations = useQuery(
      GetTranslationsForStopDeparturesDocument,
      {
        variables: {
          ids: stopIds,
          language: lang,
          numberOfDepartures: largest,
        },
        pollInterval: pollInterval,
        context: { clientName: 'default' },
      },
    );
    const stationStopTranslations = useQuery(
      GetTransLationsForStationDeparturesDocument,
      {
        variables: {
          ids: stationIds,
          language: lang,
          numberOfDepartures: largest,
        },
        pollInterval: pollInterval,
        context: { clientName: 'default' },
      },
    );
    const stops = stopTranslations?.data?.stops;
    const stationStops = stationStopTranslations?.data?.stations?.map(st => {
      return { stops: st.stops, stoptimesForPatterns: st.stoptimesForPatterns };
    });
    let combinedStops = stops?.concat(stationStops);
    combinedStops = combinedStops?.filter(Boolean);
    if (combinedStops) {
      getTranslations(combinedStops, lang, departureTranslations);
    }
  });
  return <CarouselContainer translations={departureTranslations} {...rest} />;
};

export default TranslationContainer;
