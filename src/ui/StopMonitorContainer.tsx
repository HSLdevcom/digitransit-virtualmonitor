import React, { FC, useState, useEffect } from 'react';
import { IMonitorConfig } from '../App';
import CarouselDataContainer from './CarouselDataContainer';
import { defaultStopCard } from '../util/stopCardUtil';
import { gql, useQuery } from '@apollo/client';
import Loading from './Loading';
import { GetStops, GetStopsVariables } from '../generated/GetStops';

interface IProps {
  stopIds: Array<string>;
  layout?: number;
  config: IMonitorConfig;
  urlTitle?: string;
}

export const GET_STOP = gql`
  query GetStops($ids: [String!]!) @api(contextKey: "clientName") {
    stops: stops(ids: $ids) {
      name
      gtfsId
      locationType
      lat
      lon
    }
  }
`;

const setLayoutByNumber = number => {
  if (number <= 4) {
    return 1;
  } else if (number > 4 && number < 8) {
    return 2;
  }
  return 3;
};

const StopMonitorContainer: FC<IProps> = ({
  stopIds,
  layout = 2,
  urlTitle,
}) => {
  const [stopCard, setStopCard] = useState([defaultStopCard()]);
  const [fetched, setFetched] = useState(false);

  const { data, loading } = useQuery<GetStops, GetStopsVariables>(GET_STOP, {
    variables: { ids: stopIds },
    skip: stopIds.length < 1,
    context: { clientName: 'default' },
  });

  const newLayout = setLayoutByNumber(layout);

  useEffect(() => {
    if (data) {
      const card = stopCard.slice();
      card[0].columns.left.stops = data.stops.filter(s => s);
      card[0].layout = newLayout;
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
  return (
    <CarouselDataContainer
      languages={['fi']}
      views={stopCard}
      fromStop
      initTime={new Date().getTime()}
    />
  );
};

export default StopMonitorContainer;
