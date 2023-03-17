import React, { useEffect, FC, useState } from 'react';
import { StopQueryDocument, StationQueryDocument } from '../generated';
import { useQuery } from '@apollo/client';
import StopCardListContainer from './StopCardListContainer';
import { sortBy } from 'lodash';
import { stringifyPattern } from '../util/monitorUtils';

interface IProps {
  stopCardList: any;
  stopIds: Array<string>;
  stationIds: Array<string>;
  languages: Array<string>;
  loading: boolean;
  staticMonitor?: any;
  mapSettings?: any;
}

const StopCardListDataContainer: FC<IProps> = ({
  stopCardList,
  stopIds,
  stationIds,
  languages,
  loading,
  staticMonitor,
  mapSettings,
}) => {
  const [cardList, setCardList] = useState(stopCardList);
  const stops = useQuery(StopQueryDocument, {
    variables: { ids: stopIds },
    skip: stopIds.length < 1,
    context: { clientName: 'default' },
  });
  const stations = useQuery(StationQueryDocument, {
    variables: { ids: stationIds },
    skip: stationIds.length < 1,
    context: { clientName: 'default' },
  });
  const getHiddenRoutes = (hiddenRoutes, patterns) => {
    return hiddenRoutes.filter(route => {
      return patterns.some(pattern => stringifyPattern(pattern) === route);
    });
  };
  const getStopForMonitor = (savedStop, otpStop) => {
    const hiddenRoutes = savedStop.settings?.hiddenRoutes;
    if (hiddenRoutes?.length) {
      savedStop.settings.hiddenRoutes = getHiddenRoutes(
        hiddenRoutes,
        otpStop.patterns,
      );
    }
    return {
      ...savedStop,
      ...otpStop,
      patterns: sortBy(otpStop.patterns, 'route.shortName'),
    };
  };
  const getStationForMonitor = (savedStation, otpStation) => {
    const patterns = [];
    otpStation.stops.forEach(stop => patterns.push(...stop.patterns));
    const hiddenRoutes = savedStation.settings?.hiddenRoutes;
    if (hiddenRoutes?.length) {
      savedStation.settings.hiddenRoutes = getHiddenRoutes(
        hiddenRoutes,
        patterns,
      );
    }
    return {
      ...savedStation,
      ...otpStation,
      desc: otpStation.stops[0].desc,
      patterns: sortBy(patterns, 'route.shortName'),
    };
  };
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
            richCard[j].columns.left.stops[leftIndex] = getStopForMonitor(
              richCard[j].columns.left.stops[leftIndex],
              stop,
            );
          }
          if (rightIndex > -1) {
            richCard[j].columns.right.stops[rightIndex] = getStopForMonitor(
              richCard[j].columns.right.stops[rightIndex],
              stop,
            );
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
            .map(s => s?.gtfsId)
            .indexOf(station?.gtfsId);
          const rightIndex = card.columns.right.stops
            .map(s => s?.gtfsId)
            .indexOf(station?.gtfsId);
          if (leftIndex > -1) {
            richCard[j].columns.left.stops[leftIndex] = getStationForMonitor(
              richCard[j].columns.left.stops[leftIndex],
              station,
            );
          }
          if (rightIndex > -1) {
            richCard[j].columns.right.stops[rightIndex] = getStationForMonitor(
              richCard[j].columns.right.stops[rightIndex],
              station,
            );
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
      stopCards={cardList}
      staticMonitor={staticMonitor}
      mapSettings={mapSettings}
    />
  );
};

export default StopCardListDataContainer;
