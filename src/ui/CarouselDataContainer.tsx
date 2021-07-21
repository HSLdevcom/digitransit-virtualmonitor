import React, { FC, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_STOP_DEPARTURES,
  GET_STATION_DEPARTURES,
} from '../queries/departureQueries';
import CarouselContainer from './CarouselContainer';
import { IView } from '../util/Interfaces';
import {
  getStopsAndStationsFromViews,
  getDeparturesWithoutHiddenRoutes,
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
  const defaultSettings = {
    hiddenRoutes: [],
    timeshift: 0,
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
      const copy = [];
      const stringsToTranslate = [];
      views.forEach((view, i) => {
        Object.keys(view.columns).forEach(column => {
          const departureArray = [];
          stops.forEach(stop => {
            const stopIndex = view.columns[column].stops
              .map(stop => stop.gtfsId)
              .indexOf(stop.gtfsId);
            if (stopIndex >= 0) {
              stop.patterns.forEach(r => {
                stringsToTranslate.push(r.headsign);
              });
              const { hiddenRoutes, timeshift } =
                view.columns[column].stops[stopIndex].settings ? view.columns[column].stops[stopIndex].settings : defaultSettings;
              departureArray.push(
                ...getDeparturesWithoutHiddenRoutes(
                  stop,
                  hiddenRoutes,
                  timeshift,
                ),
              );
            }
          });
          const colIndex = column === 'left' ? 0 : 1;
          copy[i] = copy[i] ? copy[i] : [[], []];
          copy[i][colIndex] = departureArray;
        });
      });
      setTranslationIds(translationIds.concat(stringsToTranslate));
      setStopDepartures(copy);
      setStopsFetched(true);
    }
  }, [stopsState]);

  useEffect(() => {
    const stations = stationsState?.data?.stations;
    if (stations?.length > 0) {
      console.log('REFETCH STATIONS');
      const copy = [];
      const stringsToTranslate = [];
      views.forEach((view, i) => {
        Object.keys(view.columns).forEach(column => {
          const departureArray = [];
          stations.forEach(stop => {
            const stopIndex = view.columns[column].stops
              .map(stop => stop.gtfsId)
              .indexOf(stop.gtfsId);
            if (stopIndex >= 0) {
              stop.stops.forEach(s => {
                s.routes.forEach(r => {
                  stringsToTranslate.push(...r.patterns.map(p => p.headsign));
                });
              });
              const { hiddenRoutes, timeshift } =
                view.columns[column].stops[stopIndex].settings ? view.columns[column].stops[stopIndex].settings : defaultSettings;
              departureArray.push(
                ...getDeparturesWithoutHiddenRoutes(
                  stop,
                  hiddenRoutes,
                  timeshift,
                ),
              );
            }
          });
          const colIndex = column === 'left' ? 0 : 1;
          copy[i] = copy[i] ? copy[i] : [[], []];
          copy[i][colIndex] = departureArray;
        });
      });
      setTranslationIds(translationIds.concat(stringsToTranslate));
      setStationDepartures(copy);
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
