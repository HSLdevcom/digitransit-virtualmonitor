import React, { FC, useEffect, useState } from 'react';
import { defaultStopCard } from '../util/stopCardUtil';
import { gql, useQuery } from '@apollo/client';
import monitorAPI from '../api';
import { Redirect } from 'react-router-dom';
import Loading from './Loading';
import hash from 'object-hash';
import {
  GetStopsForOldMonitors,
  GetStopsForOldMonitorsVariables,
} from '../generated/GetStopsForOldMonitors';

interface IProps {
  display: any;
}

export const GET_STOP = gql`
  query GetStopsForOldMonitors($ids: [String!]!)
  @api(contextKey: "clientName") {
    stops: stops(ids: $ids) {
      name
      gtfsId
      locationType
    }
  }
`;
const findClosest = (arr, goal) => {
  return arr.reduce((prev, curr) =>
    Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev,
  );
};

const migrateMonitor = (display, stops): any => {
  const cards = display.viewCarousel.map((view, i) => {
    const displayRouteOptions = [4, 8, 12];
    const displayDurationOptions = [3, 5, 10, 15, 20, 25, 30];
    const { displayedRoutes } = view.view;
    const closestRoutes = findClosest(displayRouteOptions, displayedRoutes);
    const closestDuration = findClosest(
      displayDurationOptions,
      parseInt(view.displaySeconds),
    );
    const newStops = view.view.stops.map(stop =>
      stops.find(s => s.gtfsId === stop.gtfsId),
    );
    return {
      id: i,
      duration: closestDuration,
      layout: closestRoutes / 4,
      title: {
        fi: view.view.title.fi || '',
        en: view.view.title.en || '',
        sv: view.view.title.sv || '',
      },
      columns: {
        left: {
          inUse: true,
          stops: newStops,
        },
        right: {
          inUse: false,
          stops: [],
        },
      },
    };
  });
  const migratedMonitor = {
    cards: cards,
    languages: ['fi'],
  };
  return migratedMonitor;
};
const getStops = display => {
  const stopIds = [];
  display.viewCarousel.forEach(view => {
    view.view.stops.forEach(s => stopIds.push(s.gtfsId));
  });
  return stopIds;
};

const OldMonitorParser: FC<IProps> = ({ display }) => {
  const stopIds = getStops(display);
  const [newCard, setNewCard] = useState({
    cards: [defaultStopCard()],
    languages: ['fi'],
    contenthash: '',
  });
  const [redirect, setRedirect] = useState(false);
  const { data } = useQuery<
    GetStopsForOldMonitors,
    GetStopsForOldMonitorsVariables
  >(GET_STOP, {
    variables: { ids: stopIds },
    skip: stopIds.length < 1,
    context: { clientName: 'default' },
  });
  useEffect(() => {
    if (data?.stops) {
      const monitor = migrateMonitor(display, data.stops);
      monitor.contenthash = hash(monitor, {
        algorithm: 'md5',
        encoding: 'base64',
      }).replaceAll('/', '-');
      setNewCard(monitor);
      monitorAPI.create(monitor).then(res => {
        setRedirect(true);
      });
    }
  }, [data]);
  if (!redirect) {
    return <Loading />;
  }
  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: '/view',
          search: `?cont=${newCard.contenthash}`,
          state: { view: newCard.cards },
        }}
      />
    );
  }
};
export default OldMonitorParser;
