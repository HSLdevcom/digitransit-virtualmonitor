import React, { FC, useState, useEffect, useCallback } from 'react';
import { gql, useQuery } from '@apollo/client';
import CarouselDataContainer from './CarouselDataContainer';
import { getCurrentDateWithFormat } from '../time';

const GET_TRACKS = gql`
  query getTracks(
    $date: Date!
    $trainClause: TrainWhere!
    $stationIds: TimeTableRowWhere!
  ) @api(contextKey: "clientName") {
    trainsByDepartureDate(departureDate: $date, where: $trainClause) {
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
          ids.push(
            stop.parentStation ? stop.parentStation : stop.gtfsId,
          );
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
  const shortCodes = stationIds.map(
    id => dataMap.find(i => i.gtfsId === id).shortCode,
  );

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

  /*const getTracks = useCallback(async () => {
    const query = await useQuery(GET_TRACKS, {
      variables: {
        stationIds: {
          and: [{ type: { equals: 'DEPARTURE' } }, { or: props.queryObject }],
        },
        trainClause: {
          and: [
            { trainType: { trainCategory: { name: { equals: 'Commuter' } } } },
            { timetableType: { unequals: 'ADHOC' } },
            { or: props.queryObject2 },
          ],
        },
        date: getCurrentDateWithFormat('yyyy-MM-dd'),
      },
      context: { clientName: 'rail' },
    });
    const newData = await query.data;
    console.log('RAIL DATA:', newData);
    setRailData(newData);
  }, [railData]);

  //getTracks();
  /*if (railData) {
    console.log('railData:', railData);
  }*/

  return (
    <CarouselDataContainer
      views={props.monitor.cards}
      languages={props.monitor.languages}
      railData={railData}
    />
  );
};

export default TrainDataFetcher;
