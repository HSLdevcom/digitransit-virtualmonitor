import React, { FC, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_STOP_DEPARTURES,
  GET_STATION_DEPARTURES,
} from '../queries/departureQueries';
import { IView } from '../util/Interfaces';
import {
  getStopsAndStationsFromViews,
  getDeparturesWithoutHiddenRoutes,
  createDepartureArray
} from '../util/monitorUtils';
import TranslationContainer from './TranslationContainer';
import Loading from './Loading';
import { uniq } from 'lodash';

interface IProps {
  views: Array<IView>;
  languages: Array<string>;
  preview?: boolean;
}

const CarouselDataContainer: FC<IProps> = ({ views, languages, preview }) => {
  const pollInterval = preview ? 0 : 30000;
  const emptyDepartureArrays = [];

  for (let i = 0; i < views.length; i++) {
    emptyDepartureArrays.push([[], []]);
  }

  const [stopIds, stationIds] = getStopsAndStationsFromViews(views);
  const [stopDepartures, setStopDepartures] = useState(emptyDepartureArrays);
  const [stationDepartures, setStationDepartures] =
    useState(emptyDepartureArrays);
  const [stopsFetched, setStopsFetched] = useState(stopIds.length < 1);
  const [stationsFetched, setStationsFetched] = useState(stationIds.length < 1);
  const [translationIds, setTranslationIds] = useState([]);

  const stationsState = useQuery(GET_STATION_DEPARTURES, {
    variables: { ids: stationIds, numberOfDepartures: 24 },
    pollInterval: pollInterval,
    skip: stationIds.length < 1,
  });

  const stopsState = useQuery(GET_STOP_DEPARTURES, {
    variables: { ids: stopIds, numberOfDepartures: 24 },
    pollInterval: pollInterval,
    skip: stopIds.length < 1,
  });

  useEffect(() => {
    const stops = stopsState?.data?.stops;
    if (stops?.length > 0) {
      const [stringsToTranslate, newDepartureArray] = createDepartureArray(views, stops);
      setTranslationIds(translationIds.concat(stringsToTranslate));
      setStopDepartures(newDepartureArray);
      setStopsFetched(true);
    }
  }, [stopsState]);

  useEffect(() => {
    const stations = stationsState?.data?.stations;
    if (stations?.length > 0) {
      const [stringsToTranslate, newDepartureArray ] = createDepartureArray(views, stations, true);
      setTranslationIds(translationIds.concat(stringsToTranslate));
      setStationDepartures(newDepartureArray);
      setStationsFetched(true);
    }
  }, [stationsState]);
  if (!stopsFetched || !stationsFetched) {
    return <Loading />;
  }
  return (
    <TranslationContainer
      languages={languages}
      translationIds={uniq(translationIds)}
      stopDepartures={stopDepartures}
      stationDepartures={stationDepartures}
      views={views}
      preview={preview}
    />
  );
};

export default CarouselDataContainer;
