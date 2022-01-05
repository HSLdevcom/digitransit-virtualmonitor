import React, { FC, useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import CarouselDataContainer from './CarouselDataContainer';
import { IMonitor } from '../util/Interfaces';
import Loading from './Loading';
import {
  getTodayWithFormat,
  utcToSeconds,
  formattedDateTimeFromSeconds,
  getTomorrowWithFormat,
} from '../time';
import { sortBy } from 'lodash';
import { trainStationMap } from '../util/trainStations';
import { ITrainData } from '../util/Interfaces';

const GET_TRACKS = gql`
  query getTracks(
    $dateToday: Date!
    $dateTomorrow: Date!
    $trainClause: TrainWhere!
    $stationIds: TimeTableRowWhere!
  ) @api(contextKey: "clientName") {
    today: trainsByDepartureDate(
      departureDate: $dateToday
      where: $trainClause
    ) {
      commuterLineid
      trainNumber
      timetableType
      runningCurrently
      timeTableRows(where: $stationIds) {
        commercialStop
        type
        scheduledTime
        trainStopping
        actualTime
        commercialTrack
        station {
          name
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
      timeTableRows(where: $stationIds) {
        commercialStop
        type
        scheduledTime
        trainStopping
        actualTime
        commercialTrack
        station {
          name
        }
      }
    }
  }
`;

const GET_LINE_IDS = gql`
  query getLineIds($stationIds: [String]!) @api(contextKey: "clientName") {
    stations(ids: $stationIds) {
      name
      gtfsId
      stops {
        patterns {
          route {
            shortName
          }
        }
      }
    }
  }
`;

const createLineIdsArray = data => {
  const lineIds = [];
  if (data) {
    data.stations
      .filter(s => s)
      .forEach(station => {
        station.stops.forEach(stop => {
          stop.patterns.forEach(pattern => {
            lineIds.push(pattern.route.shortName);
          });
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

interface IProps {
  monitor: IMonitor;
  stationIds: Array<string>;
  preview?: boolean;
  staticContentHash?: string;
  staticUrl?: string;
  staticViewTitle?: string;
}

const TrainDataFetcher: FC<IProps> = ({
  monitor,
  stationIds,
  preview = false,
  staticContentHash,
  staticUrl,
  staticViewTitle,
}) => {
  const [getLineIds, lineIdsState] = useLazyQuery(GET_LINE_IDS);
  const [getTrainsWithTracks, trainsWithTrackState] = useLazyQuery(GET_TRACKS);
  const [trainsWithTrack, setTrainsWithTrack] = useState([]);
  const [queryObjects, setQueryObjects] = useState([]);
  if (!lineIdsState.loading && !lineIdsState.data) {
    const ids = stationIds.map(st => st['gtfsId']);
    getLineIds({
      variables: { stationIds: stationIds },
      context: { clientName: 'hsl' },
    });
  }

  useEffect(() => {
    if (lineIdsState.data) {
      const shortCodes = stationIds.map(id => {
        return trainStationMap?.find(i => i.gtfsId === id)?.shortCode;
      });
      const stations = shortCodes
        .filter(a => a)
        .map(code => {
          return { station: { shortCode: { equals: code } } };
        });
      const lineIds = createLineIdsArray(lineIdsState.data)
        .map(shortName => {
          return { commuterLineid: { equals: shortName } };
        })
        .filter(x => x);

      setQueryObjects([stations, lineIds]);
    }
  }, [lineIdsState.data]);
  if (
    !trainsWithTrackState.loading &&
    !trainsWithTrackState.data &&
    !lineIdsState.loading &&
    lineIdsState.data &&
    queryObjects.length === 2 &&
    queryObjects[0].length > 0 &&
    queryObjects[1].length > 0
  ) {
    getTrainsWithTracks({
      variables: {
        stationIds: {
          and: [{ type: { equals: 'DEPARTURE' } }, { or: queryObjects[0] }],
        },
        trainClause: {
          and: [
            { trainType: { trainCategory: { name: { equals: 'Commuter' } } } },
            { or: queryObjects[1] },
          ],
        },
        dateToday: getTodayWithFormat('yyyy-MM-dd'),
        dateTomorrow: getTomorrowWithFormat('yyyy-MM-dd'),
      },
      context: { clientName: 'rail' },
    });
  }

  useEffect(() => {
    if (trainsWithTrackState.data) {
      const trainsWithTrack = [];
      ['today', 'tomorrow'].forEach(day => {
        trainsWithTrackState.data[day].forEach(train => {
          if (train.timeTableRows !== null) {
            trainsWithTrack.push({
              lineId: train.commuterLineid,
              time: formattedDateTimeFromSeconds(
                utcToSeconds(train.timeTableRows[0].scheduledTime),
                'yyyy-MM-dd HH:mm:ss',
              ),
              timeInSecs: utcToSeconds(train.timeTableRows[0].scheduledTime),
              track: train.timeTableRows[0].commercialTrack,
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
