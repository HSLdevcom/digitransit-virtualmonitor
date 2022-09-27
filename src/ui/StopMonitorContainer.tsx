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
        .map(st => {
          return { ...st, mode: st.vehicleMode };
        });
      card[0].layout = layout;
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
