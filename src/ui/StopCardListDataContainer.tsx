import React, { useEffect, FC, useState } from 'react';
import { GET_STOP, GET_STATION } from '../queries/stopStationQueries';
import { useQuery } from '@apollo/client';
import Loading from './Loading';
import StopCardListContainer from './StopCardListContainer';
import { sortBy, uniqBy } from 'lodash';
import { withTranslation, WithTranslation } from 'react-i18next';

interface IProps {
  stopCardList: any;
  feedIds: Array<string>;
  stopIds: Array<string>;
  stationIds: Array<string>;
  languages: Array<string>;
}

const StopCardListDataContainer: FC<IProps & WithTranslation> = ({
  feedIds,
  stopCardList,
  stopIds,
  stationIds,
  languages,
  t,
}) => {
  const [cardList, setCardList] = useState(stopCardList);
  const stops = useQuery(GET_STOP, {
    variables: { ids: stopIds },
    skip: stopIds.length < 1,
  });
  const stations = useQuery(GET_STATION, {
    variables: { ids: stationIds },
    skip: stationIds.length < 1,
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
              ...richCard[j].columns.left.stops[rightIndex],
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
  }, [stops]);

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
              code: t('station'),
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
            patterns = uniqBy(patterns, 'pattern.code');
            richCard[j].columns.right.stops[rightIndex] = {
              ...richCard[j].columns.left.stops[rightIndex],
              ...stop,
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
  }, [stations]);

  if (stations.loading || stops.loading) {
    return <Loading />;
  }
  return (
    <StopCardListContainer
      languages={languages}
      feedIds={feedIds}
      defaultStopCardList={cardList}
    />
  );
};

export default withTranslation('translations')(StopCardListDataContainer);
