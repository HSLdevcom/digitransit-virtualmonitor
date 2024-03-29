import React, { FC, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ICard } from '../util/Interfaces';
import Loading from './Loading';
import { trainStationMap } from '../util/trainStations';
import { stringifyPattern } from '../util/monitorUtils';
import TrainDataFetcher from './TrainDataFetcher';
import { GetLineIdsDocument } from '../generated';
import { useMergeState } from '../util/utilityHooks';

const createLineIdsArray = (data, hiddenRoutes) => {
  const filteredHiddenRoutes = hiddenRoutes.reduce((flatten, arr) => [
    ...flatten,
    ...arr,
  ]);
  const lineIds = [];
  if (data) {
    data.stations
      .filter(s => s)
      .forEach(station => {
        station.stops.forEach(stop => {
          const routes =
            stop?.stoptimesForPatterns.map(stoptimes => stoptimes.pattern) ||
            [];
          routes.forEach(pattern => {
            if (!filteredHiddenRoutes.includes(stringifyPattern(pattern))) {
              lineIds.push({
                gtfsId: stop.gtfsId,
                parentStation: station.gtfsId,
                shortName: pattern.route.shortName,
                stringifiedPattern: stringifyPattern(pattern),
              });
            }
          });
        });
      });
    data.stops
      .filter(s => s)
      .forEach(stop => {
        const routes =
          stop?.stoptimesForPatterns.map(stoptimes => stoptimes.pattern) || [];
        routes.forEach(pattern => {
          if (!filteredHiddenRoutes.includes(stringifyPattern(pattern))) {
            lineIds.push({
              gtfsId: stop.gtfsId,
              parentStation: stop.parentStation
                ? stop.parentStation.gtfsId
                : stop.gtfsId,
              shortName: pattern.route.shortName,
              stringifiedPattern: stringifyPattern(pattern),
            });
          }
        });
      });
  }
  return lineIds;
};

interface IProps {
  stations?: Array<ICard>;
  stops?: Array<ICard>;
  setQueryError?: any;
  queryError?: boolean;
  [x: string]: any;
}

const TrainDataPreparer: FC<IProps> = ({
  stations,
  stops,
  setQueryError,
  ...rest
}) => {
  const defaultState = useQuery(GetLineIdsDocument, {
    variables: {
      stations: stations.map(st => st.gtfsId),
      stops: stops.map(st => st.gtfsId),
    },
    context: { clientName: 'default' },
  });
  const [state, setState] = useMergeState({
    defaultLines: undefined,
    stopAndRoutes: [],
  });

  const hiddenRoutes = stations.concat(stops).map(st => st.hiddenRoutes);

  useEffect(() => {
    if (defaultState.data) {
      const stopAndRoutes = [];
      const lineIds = createLineIdsArray(defaultState.data, hiddenRoutes)
        .map(m => {
          const r = stopAndRoutes[m.parentStation]?.routes;
          const hslId = trainStationMap?.find(
            i => i.gtfsId === m.parentStation,
          )?.shortCode;
          const shortCode = hslId ? hslId : undefined;

          if (!r || r.indexOf(m.shortName) === -1) {
            stopAndRoutes.push({
              routes:
                r && r.length > 0
                  ? r.concat(',').concat(m.shortName)
                  : m.shortName,
              shortCode: shortCode,
              parentStation: m.parentStation,
            });
          }
          // get the number at the end of the shortname (IC 149 -> 149)
          const number = m.shortName.match(/\d+$/)?.[0];
          // if the shortname has a number we assume it's a long distance train
          if (Number.isInteger(parseInt(number))) {
            return { trainNumber: { equals: parseInt(number) } };
          }
          return { commuterLineid: { equals: m.shortName } };
        })
        .filter(x => x);
      setState({ defaultLines: lineIds, stopAndRoutes: stopAndRoutes });
    }
  }, [defaultState.data]);

  if (defaultState.loading) {
    return <Loading />;
  }

  const { defaultLines, stopAndRoutes } = state;
  return (
    <TrainDataFetcher
      defaultLines={defaultLines ? defaultLines : []}
      stopAndRoutes={stopAndRoutes}
      setQueryError={setQueryError}
      {...rest}
    />
  );
};

export default TrainDataPreparer;
