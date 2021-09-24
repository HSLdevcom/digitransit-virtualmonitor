import React, { FC, useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import CarouselDataContainer from './CarouselDataContainer';
import Loading from './Loading';
import {
  getTodayWithFormat,
  utcToSeconds,
  formattedDateTimeFromSeconds,
  getTomorrowWithFormat,
} from '../time';
import { sortBy } from 'lodash';
import { trainStationMap } from '../util/trainStations';

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

const getStationIds = monitor => {
  const ids = [];
  monitor.cards.forEach(card => {
    Object.keys(card.columns).forEach(column => {
      card.columns[column].stops?.forEach(stop => {
        if (stop.mode === 'RAIL') {
          ids.push(stop.parentStation ? stop.parentStation : stop.gtfsId);
        }
      });
    });
  });
  return ids;
};

const createLineIdsArray = data => {
  const lineIds = [];
  if (data) {
    data.stations.forEach(station => {
      station.stops.forEach(stop => {
        stop.patterns.forEach(pattern => {
          lineIds.push(pattern.route.shortName);
        });
      });
    });
  }
  return Array.from(new Set(lineIds));
};

const isPlatformOrTrackVisible = monitor => {
  let showPlatformOrTrack = false;
  monitor.cards.forEach(card => {
    Object.keys(card.columns).forEach(column => {
      card.columns[column].stops?.forEach(stop => {
        if (stop.settings && stop.settings.showStopNumber) {
          showPlatformOrTrack = true;
        }
      });
    });
  });
  return showPlatformOrTrack;
};

interface IProps {
  monitor: any;
}

const TrainDataFetcher: FC<IProps> = props => {
  const stationIds = getStationIds(props.monitor);
  const showPlatformsOrTracks = stationIds.length
    ? isPlatformOrTrackVisible(props.monitor)
    : false;
  if (!stationIds.length || !showPlatformsOrTracks) {
    return (
      <CarouselDataContainer
        views={props.monitor.cards}
        languages={props.monitor.languages}
      />
    );
  }
  const [getLineIds, lineIdsState] = useLazyQuery(GET_LINE_IDS);
  const [getTrainsWithTracks, trainsWithTrackState] = useLazyQuery(GET_TRACKS);
  const [trainsWithTrack, setTrainsWithTrack] = useState([]);
  const [queryObjects, setQueryObjects] = useState([]);

  if (!lineIdsState.loading && !lineIdsState.data) {
    getLineIds({
      variables: { stationIds: stationIds },
      context: { clientName: 'hsl' },
    });
  }

  useEffect(() => {
    if (lineIdsState.data) {
      const shortCodes = stationIds.map(
        id => trainStationMap?.find(i => i.gtfsId === id).shortCode,
      );

      const queryObject = shortCodes.map(code => {
        return { station: { shortCode: { equals: code } } };
      });

      const queryObject2 = createLineIdsArray(lineIdsState.data)
        .map(shortName => {
          return { commuterLineid: { equals: shortName } };
        })
        .filter(x => x !== undefined);

      setQueryObjects([queryObject, queryObject2]);
    }
  }, [lineIdsState.data]);

  if (
    !trainsWithTrackState.loading &&
    !trainsWithTrackState.data &&
    !lineIdsState.loading &&
    lineIdsState.data &&
    queryObjects.length === 2
  ) {
    getTrainsWithTracks({
      variables: {
        stationIds: {
          and: [{ type: { equals: 'DEPARTURE' } }, { or: queryObjects[0] }],
        },
        trainClause: {
          and: [
            { trainType: { trainCategory: { name: { equals: 'Commuter' } } } },
            { timetableType: { unequals: 'ADHOC' } },
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
      views={props.monitor.cards}
      languages={props.monitor.languages}
      trainsWithTrack={sortBy(trainsWithTrack, 'timeInSecs')}
    />
  );
};

export default TrainDataFetcher;
