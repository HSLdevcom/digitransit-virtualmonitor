import React, { FC, useState, useEffect } from 'react';
import CarouselDataContainer from './CarouselDataContainer';
import { defaultStopCard } from '../util/stopCardUtil';
import { useQuery } from '@apollo/client';
import Loading from './Loading';
import {
  GetStationsForStationMonitorDocument,
  GetStopsForStopMonitorDocument,
} from '../generated';
import { MonitorContext } from '../contexts';

interface IProps {
  stopIds: Array<string>;
  layout?: number;
  urlTitle?: string;
  station?: boolean;
}

const getLayoutByNumber = number => {
  if (number <= 4) {
    return 1;
  } else if (number > 4 && number <= 8) {
    return 2;
  }
  return 3;
};

/**
 * Used for creating monitors based on URL addresses e.g
 * /stop/<gtfsId> or /station/<gtfsId> for example for
 * the purpose of linking from journey planner
 */
const StopMonitorContainer: FC<IProps> = ({
  stopIds,
  layout = 2,
  urlTitle,
  station = false,
}) => {
  const [stopCard, setStopCard] = useState([defaultStopCard()]);
  const [fetched, setFetched] = useState(false);

  const document = station
    ? GetStationsForStationMonitorDocument
    : GetStopsForStopMonitorDocument;

  const { data, loading } = useQuery(document, {
    variables: { ids: stopIds },
    skip: stopIds.length < 1,
    context: { clientName: 'default' },
  });

  useEffect(() => {
    if (data) {
      const card = stopCard.slice();
      card[0].columns.left.stops = data.stops
        .filter(s => s)
        .map(stop => {
          return { ...stop, mode: stop.vehicleMode };
        });
      card[0].layout = getLayoutByNumber(layout);
      if (stopIds.length === 1) {
        card[0].title.fi = urlTitle || data.stops[0]?.name;
      } else {
        card[0].title.fi = urlTitle;
      }
      setStopCard(card);
      setFetched(true);
    }
  }, [data]);
  if (loading || !fetched) {
    return <Loading />;
  }
  const monitor = {
    cards: stopCard,
    languages: ['fi'],
  };
  return (
    <MonitorContext.Provider value={monitor}>
      <CarouselDataContainer fromStop initTime={new Date().getTime()} />
    </MonitorContext.Provider>
  );
};

export default StopMonitorContainer;
