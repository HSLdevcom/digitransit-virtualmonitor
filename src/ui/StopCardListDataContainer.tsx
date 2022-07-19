import React, { useEffect, FC, useState } from 'react';
import { GET_STOP, GET_STATION } from '../queries/stopStationQueries';
import { stopQuery, stopQueryVariables } from '../generated/stopQuery';
import { stationQuery, stationQueryVariables } from '../generated/stationQuery';
import { useQuery } from '@apollo/client';
import StopCardListContainer from './StopCardListContainer';
import { sortBy, uniqBy } from 'lodash';

interface IProps {
  stopCardList: any;
  stopIds: Array<string>;
  stationIds: Array<string>;
  languages: Array<string>;
  loading: boolean;
  staticMonitor?: any;
}

const StopCardListDataContainer: FC<IProps> = ({
  stopCardList,
  stopIds,
  stationIds,
  languages,
  loading,
  staticMonitor,
}) => {
  const [cardList, setCardList] = useState(stopCardList);
  const stops = useQuery<stopQuery, stopQueryVariables>(GET_STOP, {
    variables: { ids: stopIds },
    skip: stopIds.length < 1,
    context: { clientName: 'default' },
  });
  const stations = useQuery<stationQuery, stationQueryVariables>(GET_STATION, {
    variables: { ids: stationIds },
    skip: stationIds.length < 1,
    context: { clientName: 'default' },
  });
  useEffect(() => {
    if (stops.data?.stop) {
      const richCard = cardList.slice();
      stops.data.stop.forEach(stop => {
        cardList.forEach((card, j) => {
          const leftIndex = card.columns.left.stops
            .map(s => s.gtfsId)
            .indexOf(stop.gtfsId);
          const rightIndex = card.columns.right.stops
            .map(s => s.gtfsId)
            .indexOf(stop.gtfsId);
          if (leftIndex > -1) {
            const routes = stop.stoptimesForPatterns.map(
              stoptimes => stoptimes.pattern,
            );
            richCard[j].columns.left.stops[leftIndex] = {
              ...richCard[j].columns.left.stops[leftIndex],
              ...stop,
              patterns: sortBy(
                sortBy(routes, 'route.shortName'),
                'shortName.length',
              ),
            };
          }
          if (rightIndex > -1) {
            const routes = stop.stoptimesForPatterns.map(
              stoptimes => stoptimes.pattern,
            );
            richCard[j].columns.right.stops[rightIndex] = {
              ...richCard[j].columns.right.stops[rightIndex],
              ...stop,
              patterns: sortBy(
                sortBy(routes, 'route.shortName'),
                'shortName.length',
              ),
            };
          }
        });
      });
      setCardList(richCard);
    }
  }, [stops.data]);

  useEffect(() => {
    if (stations.data?.station) {
      const richCard = cardList.slice();
      stations.data.station.forEach(station => {
        cardList.forEach((card, j) => {
          const leftIndex = card.columns.left.stops
            .map(s => s.gtfsId)
            .indexOf(station.gtfsId);
          const rightIndex = card.columns.right.stops
            .map(s => s.gtfsId)
            .indexOf(station.gtfsId);
          if (leftIndex > -1) {
            let patterns = [];
            station.stops.forEach(stop =>
              patterns.push(...stop.stoptimesForPatterns),
            );
            patterns = uniqBy(patterns, 'pattern.code');
            richCard[j].columns.left.stops[leftIndex] = {
              ...richCard[j].columns.left.stops[leftIndex],
              ...station,
              desc: station.stops[0].desc,
              patterns: sortBy(
                sortBy(patterns, 'pattern.route.shortname'),
                'pattern.route.shortname.length',
              ).map(e => e.pattern),
            };
          }
          if (rightIndex > -1) {
            let patterns = [];
            station.stops.forEach(stop =>
              patterns.push(...stop.stoptimesForPatterns),
            );
            const vehiMode = station.vehicleMode;
            patterns = uniqBy(patterns, 'pattern.code');
            richCard[j].columns.right.stops[rightIndex] = {
              ...richCard[j].columns.right.stops[rightIndex],
              ...stop,
              vehicleMode: vehiMode,
              patterns: sortBy(
                sortBy(patterns, 'pattern.route.shortname'),
                'pattern.route.shortname.length',
              ).map(e => e.pattern),
            };
          }
        });
      });
      setCardList(richCard);
    }
  }, [stations.data]);
  return (
    <StopCardListContainer
      loading={stations.loading || stops.loading || loading}
      languages={languages}
      vertical={stopCardList[0].layout > 11}
      defaultStopCardList={cardList}
      staticMonitor={staticMonitor}
    />
  );
};

export default StopCardListDataContainer;
