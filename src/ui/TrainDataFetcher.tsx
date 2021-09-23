import React, { FC, useState, useEffect, useCallback } from 'react';
import { gql, useQuery } from '@apollo/client';
import CarouselDataContainer from './CarouselDataContainer';
import {
  getTodayWithFormat,
  utcToSeconds,
  formattedDateTimeFromSeconds,
  getTomorrowWithFormat,
} from '../time';
import { sortBy } from 'lodash';

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

const GET_ROUTE_SHORTNAMES = gql`
  query getRouteShortNames($stationIds: [String]!)
  @api(contextKey: "clientName") {
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

const dataMap = [
  {
    name: 'Keravan asema',
    gtfsId: 'HSL:9000202',
    shortCode: 'KE',
  },
];

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

const createRouteShortNameArray = data => {
  const routeShortNames = [];
  if (data) {
    data.stations.forEach(station => {
      station.stops.forEach(stop => {
        stop.patterns.forEach(pattern => {
          routeShortNames.push(pattern.route.shortName);
        });
      });
    });
  }
  return Array.from(new Set(routeShortNames));
};

interface IProps {
  monitor: any;
  queryObject?: any;
  queryObject2?: any;
}

const TrainDataFetcher: FC<IProps> = props => {
  const [routeData, setRouteData] = useState(undefined);
  const [railData, setRailData] = useState(undefined);
  console.log('PROPS:', props);
  console.log('routeData:', routeData);

  const stationIds = getStationIds(props.monitor);
  //Get short codes for stations (e.g. Kerava = KE, Pasila = PSL, Kannelmäki = KAN)
  /*const shortCodes = stationIds.map(
    id => dataMap?.find(i => i.gtfsId === id).shortCode,
  );*/

  /*const getRouteShortNames = useCallback(async () => {
    const query = await useQuery(GET_ROUTE_SHORTNAMES, {
      variables: {
        stationIds: stationIds,
      },
      context: { clientName: 'hsl' },
    });
    const newData = await query.data;
    console.log('ROUTE DATA:', newData);
    setRouteData(newData);
  }, [routeData]);

  getRouteShortNames();*/

  /*console.log('routeDATA:', routeData);
  if (routeData && !(props.queryObject && props.queryObject2)) {
    const queryObject = shortCodes.map(code => {
      return { station: { shortCode: { equals: code } } };
    });
  
    console.log('queryObject:', queryObject);
  
    const queryObject2 = createRouteShortNameArray(routeData).map(shortName => {
      if (shortName === 'D') {
        return { commuterLineid: { equals: shortName } };
      }
    }).filter(x => x !== undefined);
    console.log('queryObject2:', queryObject2);
    return <TrainDataFetcher monitor={props.monitor} queryObject={queryObject} queryObject2={queryObject2} />
  }*/
  const queryObject = [{ station: { shortCode: { equals: 'KE' } } }];
  const queryObject2 = [
    { commuterLineid: { equals: 'D' } },
    { commuterLineid: { equals: 'T' } },
  ];
  const getTracks = useCallback(async () => {
    const query = await useQuery(GET_TRACKS, {
      variables: {
        stationIds: {
          and: [{ type: { equals: 'DEPARTURE' } }, { or: queryObject }],
        },
        trainClause: {
          and: [
            { trainType: { trainCategory: { name: { equals: 'Commuter' } } } },
            { timetableType: { unequals: 'ADHOC' } },
            { or: queryObject2 },
          ],
        },
        dateToday: getTodayWithFormat('yyyy-MM-dd'),
        dateTomorrow: getTomorrowWithFormat('yyyy-MM-dd'),
      },
      context: { clientName: 'rail' },
    });
    const newData = await query.data;
    console.log('RAIL DATA:', newData);
    setRailData(newData);
  }, [railData]);

  getTracks();
  const trainTracks = [];
  if (railData) {
    ['today', 'tomorrow'].forEach(day => {
      railData[day].forEach(train => {
        trainTracks.push({
          lineId: train.commuterLineid,
          time: formattedDateTimeFromSeconds(
            utcToSeconds(train.timeTableRows[0].scheduledTime),
            'yyyy-MM-dd HH:mm:ss',
          ),
          timeInSecs: utcToSeconds(train.timeTableRows[0].scheduledTime),
          track: train.timeTableRows[0].commercialTrack,
        });
        //console.log('TRAIN:', train);
        //console.log(`Train ${train.commuterLineid} @ ${formattedDateTimeFromSeconds(utcToSeconds(train.timeTableRows[0].scheduledTime), 'dd.MM. HH:mm:ss')} : ${train.timeTableRows[0].commercialTrack}`);
      });
    });
  }
  console.log('Train tracks:', sortBy(trainTracks, 'timeInSecs'));

  return (
    <CarouselDataContainer
      views={props.monitor.cards}
      languages={props.monitor.languages}
      trainTracks={sortBy(trainTracks, 'timeInSecs')}
    />
  );
};

export default TrainDataFetcher;
