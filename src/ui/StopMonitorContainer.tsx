import React, { FC, useState, useEffect } from 'react';
import { IMonitorConfig } from '../App';
import CarouselDataContainer from './CarouselDataContainer';
import { defaultStopCard } from '../util/stopCardUtil';
import { withTranslation, WithTranslation } from 'react-i18next';
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

const StopMonitorContainer: FC<IProps & WithTranslation> = ({
  stopIds,
  layout = 2,
  urlTitle,
  config,
  t,
}) => {
  const [stopCard, setStopCard] = useState([defaultStopCard(t)]);
  const [fetched, setFetched] = useState(false);
  const [stopsFound, setStopsFound] = useState(true);

  const { data, loading } = useQuery<GetStops, GetStopsVariables>(GET_STOP, {
    variables: { ids: stopIds },
    skip: stopIds.length < 1,
    context: { clientName: 'default' },
  });

  const newLayout = setLayoutByNumber(layout);

  useEffect(() => {
    if (data) {
      const card = stopCard.slice();
      if (data.stops.filter(s => s).length > 0) {
        card[0].columns.left.stops = data.stops;
        card[0].layout = newLayout;
        if (stopIds.length === 1) {
          card[0].title.fi = urlTitle || data.stops[0]?.name;
        } else {
          card[0].title.fi = urlTitle;
        }
      } else {
        setStopsFound(false);
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
      error={!stopsFound ? t('noMonitors') : undefined}
      languages={['fi']}
      views={stopCard}
      fromStop
    />
  );
};

export default withTranslation('translations')(StopMonitorContainer);
