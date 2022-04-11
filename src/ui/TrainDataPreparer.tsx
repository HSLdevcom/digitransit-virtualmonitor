import React, { FC, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { IMonitor, ICard } from '../util/Interfaces';
import { uniqWith, isEqual } from 'lodash';
import Loading from './Loading';
import { trainStationMap } from '../util/trainStations';
import { stringifyPattern } from '../util/monitorUtils';
import TrainDataFetcher from './TrainDataFetcher';

const GET_LINE_IDS = gql`
  query getLineIds($stations: [String]!, $stops: [String]!)
  @api(contextKey: "clientName") {
    stations(ids: $stations) {
      name
      gtfsId
      stops {
        gtfsId
        name
        stoptimesForPatterns {
          pattern {
            code
            headsign
            route {
              gtfsId
              shortName
            }
          }
        }
      }
    }
    stops(ids: $stops) {
      gtfsId
      name
      parentStation {
        gtfsId
      }
      stoptimesForPatterns {
        pattern {
          code
          headsign
          route {
            gtfsId
            shortName
          }
        }
      }
    }
  }
`;

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
  monitor: IMonitor;
  stations?: Array<ICard>;
  stops?: Array<ICard>;
  [x: string]: any;
}

const TrainDataPreparer: FC<IProps> = ({ stations, stops, ...rest }) => {
  const defaultState = useQuery(GET_LINE_IDS, {
    variables: {
      stations: stations.map(st => st.gtfsId),
      stops: stops.map(st => st.gtfsId),
    },
    context: { clientName: 'default' },
  });

  const [defaultLines, setDefaultLines] = useState(null);
  const [stopAndRoutes, setStopAndRoutes] = useState([]);

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
      setDefaultLines(lineIds);
      setStopAndRoutes(stopAndRoutes);
    }
  }, [defaultState.data]);

  if (defaultState.loading) {
    return <Loading />;
  }
  const lines = uniqWith(defaultLines, isEqual);
  return (
    <TrainDataFetcher
      defaultLines={defaultLines ? defaultLines : []}
      stopAndRoutes={stopAndRoutes}
      {...rest}
    />
  );
};

export default TrainDataPreparer;
