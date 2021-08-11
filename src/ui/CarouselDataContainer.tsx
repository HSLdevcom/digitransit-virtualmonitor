import React, { FC, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_STOP_DEPARTURES,
  GET_STATION_DEPARTURES,
} from '../queries/departureQueries';
import { getLayout } from '../util/getLayout';
import { IView } from '../util/Interfaces';
import {
  getStopsAndStationsFromViews,
  createDepartureArray,
} from '../util/monitorUtils';
import TranslationContainer from './TranslationContainer';
import Loading from './Loading';
import { uniq, uniqBy } from 'lodash';

interface IProps {
  views: Array<IView>;
  languages: Array<string>;
  preview?: boolean;
}

const CarouselDataContainer: FC<IProps> = ({ views, languages, preview }) => {
  const pollInterval = 30000;
  const emptyDepartureArrays = [];

  for (let i = 0; i < views.length; i++) {
    emptyDepartureArrays.push([[], []]);
  }
  const layOuts = views.map(v => {
    const lay = getLayout(v.layout);
    const r1 = lay[0];
    const r2 = lay[1];
    if (typeof r1 === 'number' && typeof r2 === 'number') {
      return r1 + r2;
    }
    return null;
  });

  const largest = Math.max(...layOuts);
  const [stopIds, stationIds] = getStopsAndStationsFromViews(views);
  const [stopDepartures, setStopDepartures] = useState(emptyDepartureArrays);
  const [stationDepartures, setStationDepartures] =
    useState(emptyDepartureArrays);
  const [stopsFetched, setStopsFetched] = useState(stopIds.length < 1);
  const [stationsFetched, setStationsFetched] = useState(stationIds.length < 1);
  const [translationIds, setTranslationIds] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const stationsState = useQuery(GET_STATION_DEPARTURES, {
    variables: { ids: stationIds, numberOfDepartures: largest },
    pollInterval: pollInterval,
    skip: stationIds.length < 1,
  });

  const stopsState = useQuery(GET_STOP_DEPARTURES, {
    variables: { ids: stopIds, numberOfDepartures: largest },
    pollInterval: pollInterval,
    skip: stopIds.length < 1,
  });

  useEffect(() => {
    const stops = stopsState?.data?.stops;
    if (stops?.length > 0) {
      const [stringsToTranslate, newDepartureArray, a] = createDepartureArray(
        views,
        stops,
      );
      setTranslationIds(translationIds.concat(stringsToTranslate));
      setStopDepartures(newDepartureArray);
      const arr = alerts.concat(a);
      setAlerts(uniqBy(arr, alert => alert.alertHeaderText));
      setStopsFetched(true);
    }
  }, [stopsState]);

  useEffect(() => {
    const stations = stationsState?.data?.stations;
    if (stations?.length > 0) {
      const [stringsToTranslate, newDepartureArray, a] = createDepartureArray(
        views,
        stations,
        true,
      );
      setTranslationIds(translationIds.concat(stringsToTranslate));
      setStationDepartures(newDepartureArray);
      const arr = alerts.concat(a);
      setAlerts(uniqBy(arr, alert => alert.alertHeaderText));
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
      alerts={alerts}
      views={views}
      preview={preview}
    />
  );
};

export default CarouselDataContainer;
