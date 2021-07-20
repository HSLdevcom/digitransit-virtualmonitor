import React, { FC, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_STOP_DEPARTURES, GET_STATION_DEPARTURES } from '../queries/departureQueries';
import CarouselContainer from './CarouselContainer';
import { IView } from '../util/Interfaces';
import { getStopsAndStationsFromViews, getDeparturesWithoutHiddenRoutes } from '../util/monitorUtils';
import TranslationContainer from './TranslationContainer';
import Loading from './Loading';
import {uniq} from 'lodash';

interface IProps {
  views: Array<IView>;
  languages: Array<string>;
}

const CarouselDataContainer : FC<IProps> = ({views, languages}) => {
  const pollInterval = 10000;
  const [stopIds, stationIds] = getStopsAndStationsFromViews(views);
  const [stopDepartures, setStopDepartures] = useState([[[],[]]])
  const [stationDepartures, setStationDepartures] = useState([[[],[]]])
  const [stopsFetched, setStopsFetched] = useState(stopIds.length < 1)
  const [stationsFetched, setStationsFetched] = useState(stationIds.length < 1)
  const [translationIds, setTranslationIds] = useState([]);

  const stationsState = useQuery(GET_STATION_DEPARTURES, {
    variables: { ids: stationIds, numberOfDepartures: 24 },
    pollInterval: pollInterval,
    skip: stationIds.length < 1
  });

  const stopsState = useQuery(GET_STOP_DEPARTURES, {
    variables: { ids: stopIds, numberOfDepartures: 24 },
    pollInterval: pollInterval,
    skip: stopIds.length < 1
  });
  useEffect(() => {
    const stops = stopsState?.data?.stops;
    if (stops?.length > 0) {
      const copy = [];
      views.forEach((view, i) => {
        Object.keys(view.columns).forEach(column => {
          const departureArray = [];
          stops.forEach(stop => {
            
            const stopIndex = view.columns[column].stops.map(stop => stop.gtfsId).indexOf(stop.gtfsId);
            if (stopIndex >= 0) {
              console.log(stop)
              const stringsToTranslate = [];
              stop.patterns.forEach(r => {
                stringsToTranslate.push(r.headsign);
              })
              setTranslationIds(translationIds.concat(stringsToTranslate));
              //setTranslationIds(translationIds.concat(stop.routes.map(r => [...r.patterns.map(x => x.headsign)])))
              const { hiddenRoutes, timeshift } = view.columns[column].stops[stopIndex].settings;
              departureArray.push(...getDeparturesWithoutHiddenRoutes(stop, hiddenRoutes, timeshift));
            }
          })
          const colIndex = column === 'left' ? 0 : 1;
          copy[i] = copy[i] ? copy[i] : [[], []];
          copy[i][colIndex] = departureArray;
        })
      })
      setStopDepartures(copy);
      setStopsFetched(true)
    }
  }, [stopsState])

  useEffect(() => {
    const stations = stationsState?.data?.stations;
    if (stations?.length > 0) {
      console.log("REFETCH STATIONS")
      const copy = [];
      views.forEach((view, i) => {
        Object.keys(view.columns).forEach(column => {
          const departureArray = [];
          stations.forEach(stop => {
            const stopIndex = view.columns[column].stops.map(stop => stop.gtfsId).indexOf(stop.gtfsId);
            if (stopIndex >= 0) {
              setTranslationIds(translationIds.concat(stop.routes.map(r => r.pattern.headsign)))
              const { hiddenRoutes, timeshift } = view.columns[column].stops[stopIndex].settings;
              departureArray.push(...getDeparturesWithoutHiddenRoutes(stop, hiddenRoutes, timeshift));
            }
          })
          const colIndex = column === 'left' ? 0 : 1;
          copy[i] = copy[i] ? copy[i] : [[], []];
          copy[i][colIndex] = departureArray;
        })
      })
      setStationDepartures(copy);
      setStationsFetched(true)
    }
  }, [stationsState])
  console.log("RENDER")
  if (!stopsFetched || !stationsFetched) {
    return <Loading />
  }
  return <TranslationContainer languages={languages} translationIds={uniq(translationIds)} stopDepartures={stopDepartures} stationDepartures={stationDepartures} views={views} />
}

export default CarouselDataContainer;
