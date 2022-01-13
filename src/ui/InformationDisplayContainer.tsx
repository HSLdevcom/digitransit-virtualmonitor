import React, { FC, useState, useEffect } from 'react';
import { getStopsAndStationsFromViews } from '../util/monitorUtils';
import { useQuery } from '@apollo/client';
import { GET_STOP_ALERTS, GET_STATION_ALERTS } from '../queries/alertQueries';
import {
  GetAlertsForStations,
  GetAlertsForStationsVariables,
} from '../generated/GetAlertsForStations';
import {
  GetAlertsForStops,
  GetAlertsForStopsVariables,
} from '../generated/GetAlertsForStops';
import { uniqBy } from 'lodash';
import Loading from './Loading';
import InformationDisplayCarousel from './InformationDisplayCarousel';
import { IMonitor } from '../util/Interfaces';

interface IProps {
  monitor: IMonitor;
  preview?: boolean;
}

const getStopAlerts = stops => {
  const alerts = [];
  stops.forEach(stop => {
    alerts.push(...stop.alerts);
    stop.routes.forEach(route => {
      alerts.push(...route.alerts);
    });
  });
  return alerts;
};

const getStationAlerts = stations => {
  const alerts = [];
  stations.forEach(station => {
    alerts.push(...getStopAlerts(station.stops));
  });
  return alerts;
};
const InformationDisplayContainer: FC<IProps> = ({
  monitor,
  preview = false,
}) => {
  const [stopIds, stationIds] = getStopsAndStationsFromViews(monitor.cards);
  const [stopsFetched, setStopsFetched] = useState(stopIds.length < 1);
  const [stationsFetched, setStationsFetched] = useState(stationIds.length < 1);

  const [stopAlerts, setStopAlerts] = useState([]);
  const [stationAlerts, setStationAlerts] = useState([]);

  const stationsState = useQuery<
    GetAlertsForStations,
    GetAlertsForStationsVariables
  >(GET_STATION_ALERTS, {
    variables: { ids: stationIds },
    pollInterval: 180000,
    skip: stationIds.length < 1,
  });

  const stopsState = useQuery<GetAlertsForStops, GetAlertsForStopsVariables>(
    GET_STOP_ALERTS,
    {
      variables: { ids: stopIds },
      pollInterval: 180000,
      skip: stopIds.length < 1,
    },
  );
  useEffect(() => {
    const stops = stopsState?.data?.stops;
    if (stops?.length > 0) {
      const alerts = getStopAlerts(stops);
      setStopAlerts(uniqBy(alerts, alert => alert.alertHeaderText));
      setStopsFetched(true);
    }
  }, [stopsState.data]);

  useEffect(() => {
    const stations = stationsState?.data?.stations;
    if (stations?.length > 0) {
      const alerts = getStationAlerts(stations);
      setStationAlerts(uniqBy(alerts, alert => alert.alertHeaderText));
      setStationsFetched(true);
    }
  }, [stationsState.data]);

  if (!stopsFetched || !stationsFetched) {
    return <Loading />;
  }
  return (
    <InformationDisplayCarousel
      view={monitor.cards[0]}
      alerts={[...stopAlerts, ...stationAlerts]}
      languages={monitor.languages}
      preview={preview}
    />
  );
};

export default InformationDisplayContainer;
