import React, { FC, useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import CarouselDataContainer from './CarouselDataContainer';
import { IMonitor, ICard } from '../util/Interfaces';
import Loading from './Loading';
import {
  getTodayWithFormat,
  utcToSeconds,
  formattedDateTimeFromSeconds,
  getTomorrowWithFormat,
} from '../time';
import { sortBy, uniqWith } from 'lodash';
import { trainStationMap } from '../util/trainStations';
import { ITrainData } from '../util/Interfaces';
import { stringifyPattern } from '../util/monitorUtils';

const GET_TRACKS = gql`
  query getTracks(
    $dateToday: Date!
    $dateTomorrow: Date!
    $trainClause: TrainWhere!
    $stations: TimeTableRowWhere!
  ) @api(contextKey: "clientName") {
    today: trainsByDepartureDate(
      departureDate: $dateToday
      where: $trainClause
    ) {
      commuterLineid
      trainNumber
      timetableType
      runningCurrently
      timeTableRows(where: $stations) {
        commercialStop
        type
        scheduledTime
        trainStopping
        actualTime
        commercialTrack
        station {
          shortCode
        }
      }
    }
    tomorrow: trainsByDepartureDate(
      departureDate: $dateTomorrow
      where: $trainClause
    ) {
      commuterLineid
      trainNumber
      timetableType
      runningCurrently
      timeTableRows(where: $stations) {
        commercialStop
        type
        scheduledTime
        trainStopping
        actualTime
        commercialTrack
        station {
          shortCode
        }
      }
    }
  }
`;

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

const createLineIdsArray = (
  data,
  hiddenRoutes,
  fetchOnlyHsl,
  fetchAlsoHsl,
  secondFetch,
) => {
  let filteredHiddenRoutes = hiddenRoutes.reduce((flatten, arr) => [
    ...flatten,
    ...arr,
  ]);
  if (fetchOnlyHsl || (fetchAlsoHsl && secondFetch)) {
    filteredHiddenRoutes = filteredHiddenRoutes.filter(f =>
      f.startsWith('HSL'),
    );
  } else if (fetchAlsoHsl && !secondFetch) {
    filteredHiddenRoutes = filteredHiddenRoutes.filter(
      f => !f.startsWith('HSL'),
    );
  }

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
  return Array.from(new Set(lineIds));
};

// There could be almost two identical rows
// (difference only in track - one with number and one with null)
const removeDuplicatesWithDifferentTracks = (
  trainsWithTrack,
): Array<ITrainData> => {
  const trains = trainsWithTrack;
  const result: Array<ITrainData> = [];
  trainsWithTrack.forEach((train, index) => {
    const possibleDuplicates = trainsWithTrack.filter(
      train =>
        train.lineId === trains[index].lineId &&
        train.timeInSecs === trains[index].timeInSecs,
    );
    if (possibleDuplicates.length > 1) {
      result.push(...possibleDuplicates.filter(d => d.track !== null));
    } else {
      result.push(...possibleDuplicates);
    }
  });
  return Array.from(new Set(result));
};

const uniqueLinesOrTrains = lineIds => {
  return uniqWith(
    lineIds,
    (l1, l2) =>
      l1.commuterLineid === l2.commuterLineid ||
      l1.trainNumber === l2.trainNumber,
  );
};
interface IProps {
  monitor: IMonitor;
  stations?: Array<ICard>;
  stops?: Array<ICard>;
  preview?: boolean;
  staticContentHash?: string;
  staticUrl?: string;
  staticViewTitle?: string;
  fetchOnlyHsl?: boolean;
  fetchAlsoHsl?: boolean;
}

const TrainDataFetcher: FC<IProps> = ({
  monitor,
  stations,
  stops,
  preview = false,
  staticContentHash,
  staticUrl,
  staticViewTitle,
  fetchOnlyHsl = false,
  fetchAlsoHsl = false,
}) => {
  const [getLineIds, lineIdsState] = useLazyQuery(GET_LINE_IDS);
  const [getHslLineIds, lineHslIdsState] = useLazyQuery(GET_LINE_IDS);
  const [getTrainsWithTracks, trainsWithTrackState] = useLazyQuery(GET_TRACKS);
  const [trainsWithTrack, setTrainsWithTrack] = useState([]);
  const [linesQuery, setLinesQuery] = useState(null);
  const [stopAndRoutes, setStopAndRoutes] = useState({});

  const ids = stations.concat(stops).map(st => st['gtfsId']);
  const hiddenRoutes = stations.concat(stops).map(st => st['hiddenRoutes']);
  let withHslLines;

  const shortCodes = ids
    .map(id => {
      return {
        gtfsId: id,
        shortCode:
          trainStationMap?.find(i => i.gtfsId === id)?.shortCode ||
          id.substring(8),
      };
    })
    .filter(s => s);

  const stationsQuery = shortCodes
    .filter(a => a)
    .map(s => {
      return { station: { shortCode: { equals: s.shortCode } } };
    });

  if (!lineIdsState.loading && !lineIdsState.data) {
    getLineIds({
      variables: {
        stations: stations.map(st => st['gtfsId']),
        stops: stops.map(st => st['gtfsId']),
      },
      context: { clientName: 'default' },
    });
  }

  useEffect(() => {
    if (lineIdsState.data) {
      const stopAndRoutes = {};
      const lineIds = createLineIdsArray(
        lineIdsState.data,
        hiddenRoutes,
        fetchOnlyHsl,
        fetchAlsoHsl,
        false,
      )
        .map((m, i) => {
          const r = stopAndRoutes[m['parentStation']]?.routes;
          const shortCode =
            shortCodes[
              shortCodes.findIndex(s => s.gtfsId === m['parentStation'])
            ].shortCode;
          if (!r || r.indexOf(m['shortName']) === -1) {
            stopAndRoutes[m['parentStation']] = {
              routes:
                r && r.length > 0
                  ? r.concat(',').concat(m['shortName'])
                  : m['shortName'],
              shortCode: shortCode,
            };
          }

          if (fetchAlsoHsl && m.stringifiedPattern.startsWith('HSL')) {
            return null;
          } else {
            if (Number.isInteger(parseInt(m.shortName))) {
              return { trainNumber: { equals: parseInt(m.shortName) } };
            }
            return { commuterLineid: { equals: m.shortName } };
          }
        })
        .filter(x => x);
      const uniqueLines = uniqueLinesOrTrains(lineIds);
      setLinesQuery(
        linesQuery === null ? uniqueLines : linesQuery.concat(uniqueLines),
      );
      setStopAndRoutes(stopAndRoutes);
    }
  }, [lineIdsState.data]);

  if (
    !lineIdsState.loading &&
    lineIdsState.data &&
    !lineHslIdsState.loading &&
    !lineHslIdsState.data &&
    linesQuery !== null
  ) {
    if (!fetchOnlyHsl && fetchAlsoHsl) {
      getHslLineIds({
        variables: {
          stations: stations.map(st => st['gtfsId']),
          stops: stops.map(st => st['gtfsId']),
        },
        context: { clientName: 'hsl' },
      });
    }
  }

  useEffect(() => {
    if (lineHslIdsState.data) {
      const lineIds = createLineIdsArray(
        lineHslIdsState.data,
        hiddenRoutes,
        fetchOnlyHsl,
        fetchAlsoHsl,
        true,
      )
        .map(m => {
          if (!m.stringifiedPattern.startsWith('HSL')) {
            return null;
          } else {
            if (Number.isInteger(parseInt(m.shortName))) {
              return { trainNumber: { equals: parseInt(m.shortName) } };
            }
            return { commuterLineid: { equals: m.shortName } };
          }
        })
        .filter(x => x);

      const uniqueLines = uniqueLinesOrTrains(lineIds);
      setLinesQuery(
        linesQuery === null ? uniqueLines : linesQuery.concat(uniqueLines),
      );
    }
  }, [lineHslIdsState.data]);

  useEffect(() => {
    if (
      !trainsWithTrackState.loading &&
      !trainsWithTrackState.data &&
      !lineIdsState.loading &&
      lineIdsState.data &&
      ((!fetchAlsoHsl && !lineHslIdsState.loading && !lineHslIdsState.data) ||
        (fetchAlsoHsl && !lineHslIdsState.loading && lineHslIdsState.data))
    ) {
      getTrainsWithTracks({
        variables: {
          stations: {
            and: [{ type: { equals: 'DEPARTURE' } }, { or: stationsQuery }],
          },
          trainClause: {
            and: [
              {
                or: [
                  {
                    trainType: {
                      trainCategory: { name: { equals: 'Commuter' } },
                    },
                  },
                  {
                    trainType: {
                      trainCategory: { name: { equals: 'Long-distance' } },
                    },
                  },
                ],
              },
              { or: linesQuery },
            ],
          },
          dateToday: getTodayWithFormat('yyyy-MM-dd'),
          dateTomorrow: getTomorrowWithFormat('yyyy-MM-dd'),
        },
        context: { clientName: 'rail' },
      });
    }
  }, [linesQuery]);

  useEffect(() => {
    if (trainsWithTrackState.data) {
      const srArray = Object.keys(stopAndRoutes).map(i => stopAndRoutes[i]);
      const trainsWithTrack = [];
      ['today', 'tomorrow'].forEach(day => {
        trainsWithTrackState.data[day].forEach(train => {
          if (train.timeTableRows !== null) {
            const id =
              train.commuterLineid === ''
                ? train.trainNumber.toString()
                : train.commuterLineid;
            let idx = 0;
            if (train.timeTableRows.length > 1) {
              train.timeTableRows.forEach((t, i) => {
                const routes =
                  srArray[
                    srArray.findIndex(x => x.shortCode === t.station.shortCode)
                  ].routes;
                if (routes.indexOf(id) !== -1) {
                  idx = i;
                }
              });
            }
            trainsWithTrack.push({
              lineId: train.commuterLineid,
              trainNumber: train.trainNumber,
              time: formattedDateTimeFromSeconds(
                utcToSeconds(train.timeTableRows[idx].scheduledTime),
                'yyyy-MM-dd HH:mm:ss',
              ),
              timeInSecs: utcToSeconds(train.timeTableRows[idx].scheduledTime),
              track: train.timeTableRows[idx].commercialTrack,
            });
          }
        });
      });
      setTrainsWithTrack(trainsWithTrack);
    }
  }, [trainsWithTrackState.data]);

  if (lineIdsState.loading || trainsWithTrackState.loading) {
    return <Loading />;
  }

  return (
    <CarouselDataContainer
      views={monitor.cards}
      languages={monitor.languages}
      trainsWithTrack={removeDuplicatesWithDifferentTracks(
        sortBy(trainsWithTrack, 'timeInSecs'),
      )}
      preview={preview}
      staticContentHash={staticContentHash}
      staticUrl={staticUrl}
      staticViewTitle={staticViewTitle}
      initTime={new Date().getTime()}
    />
  );
};

export default TrainDataFetcher;
