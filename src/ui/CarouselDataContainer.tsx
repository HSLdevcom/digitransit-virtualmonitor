import React, { FC, useState, useEffect, useContext, useRef } from 'react';
import { useQuery } from '@apollo/client';
import {
  GetDeparturesForStopsDocument,
  GetDeparturesForStationsDocument,
} from '../generated';
import { getLayout } from '../util/getResources';
import { ITrainData } from '../util/Interfaces';
import {
  getStopsAndStationsFromViews,
  createDepartureArray,
} from '../util/monitorUtils';
import Loading from './Loading';
import { uniqBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import CarouselContainer from './CarouselContainer';
import { MonitorContext } from '../contexts';
import { sortAndFilter } from '../util/monitorUtils';
import { changeTopics, startMqtt, stopMqtt } from '../util/mqttUtils';
import { useMergeState } from '../util/utilityHooks';

interface IProps {
  preview?: boolean;
  trainsWithTrack?: Array<ITrainData>;
  fromStop?: boolean;
  initTime: number;
  setQueryError?: any;
  queryError?: boolean;
}

const filterEffectiveAlerts = alerts => {
  const now = new Date();
  const effectiveAlerts = alerts.filter(
    a => a.effectiveEndDate > now.getTime() / 1000,
  );
  return effectiveAlerts;
};

const CarouselDataContainer: FC<IProps> = ({
  preview,
  trainsWithTrack,
  fromStop,
  initTime,
  setQueryError,
  queryError,
}) => {
  const { cards: views, mapSettings } = useContext(MonitorContext);
  const [t] = useTranslation();
  const pollInterval = 30000;
  const emptyDepartureArrays = [];

  for (let i = 0; i < views.length; i++) {
    emptyDepartureArrays.push([[], []]);
  }
  const layOuts = views.map(v => {
    const { leftColumnCount, rightColumnCount } = getLayout(v.layout);
    return leftColumnCount + rightColumnCount;
  });

  const largest = Math.max(...layOuts);
  const [stopIds, stationIds] = getStopsAndStationsFromViews(views);
  const [stopDepartures, setStopDepartures] = useState(emptyDepartureArrays);
  const [stationDepartures, setStationDepartures] =
    useState(emptyDepartureArrays);
  const [stopsFetched, setStopsFetched] = useState(stopIds.length < 1);
  const [stationsFetched, setStationsFetched] = useState(stationIds.length < 1);
  const [alerts, setAlerts] = useState([]);
  const [closedStopViews, setClosedStopViews] = useState([]);

  const stationsState = useQuery(GetDeparturesForStationsDocument, {
    variables: { ids: stationIds, numberOfDepartures: largest },
    pollInterval: pollInterval,
    skip: stationIds.length < 1,
    context: { clientName: 'default' },
  });
  const stopsState = useQuery(GetDeparturesForStopsDocument, {
    variables: { ids: stopIds, numberOfDepartures: largest },
    pollInterval: pollInterval,
    skip: stopIds.length < 1,
    context: { clientName: 'default' },
  });
  const [forceUpdate, setforceUpdate] = useState(false);
  useEffect(() => {
    const stops = stopsState?.data?.stops;
    if (stopsState?.error && !queryError && queryError != undefined) {
      setQueryError(true);
    } else if (!stopsState?.error && queryError) {
      setQueryError(false);
    }
    if (stops?.length > 0) {
      const [newDepartureArray, a, closedStopViews] = createDepartureArray(
        views,
        stops,
        false,
        t,
        fromStop,
        initTime,
      );
      setStopDepartures(newDepartureArray);
      const arr = alerts.concat(a);
      setAlerts(
        uniqBy(
          filterEffectiveAlerts(arr),
          alert => alert.stop?.gtfsId + ':' + alert.alertHeaderText,
        ),
      );
      setStopsFetched(true);
      setClosedStopViews(closedStopViews);
    }
    // Force update interval for itineraries that needs to be filtered by timeShift setting.
    const intervalId = setInterval(() => {
      setforceUpdate(!forceUpdate);
    }, 1000 * 20);
    return () => clearInterval(intervalId);
  }, [stopsState.data, forceUpdate]);
  useEffect(() => {
    const stations = stationsState?.data?.stations;
    if (stationsState?.error && !queryError && queryError != undefined) {
      setQueryError(true);
    } else if (!stationsState?.error && queryError) {
      setQueryError(false);
    }
    if (stations?.length > 0) {
      const [newDepartureArray, a] = createDepartureArray(
        views,
        stations,
        true,
        t,
        fromStop,
        initTime,
      );
      setStationDepartures(newDepartureArray);
      const arr = alerts.concat(a);
      setAlerts(
        uniqBy(filterEffectiveAlerts(arr), alert => alert.alertHeaderText),
      );
      setStationsFetched(true);
    }
    // Force update interval for itineraries that needs to be filtered by timeShift setting.
    const intervalId = setInterval(() => {
      setforceUpdate(!forceUpdate);
    }, 1000 * 20);
    return () => clearInterval(intervalId);
  }, [stationsState.data, forceUpdate]);

  const [topicsFound, setTopicsFound] = useState(false);
  const topics = getMqttTopics(
    views,
    mapSettings,
    stationDepartures,
    stopDepartures,
    trainsWithTrack,
  );
  if (topics.length > 0 && !topicsFound) {
    setTopicsFound(true);
  }

  const [state, setState] = useMergeState({
    client: undefined,
    messages: [],
  });

  const clientRef = useRef(null);
  const topicRef = useRef(null);
  const [vehicleMarkerState, setVehicleMarkerState] = useState(new Map());

  useEffect(() => {
    if (state.client) {
      clientRef.current = state.client;
      if (topicRef.current.length === 0) {
        // We have new topics and current topics are empty, so client needs to be updated
        const settings = {
          client: clientRef.current,
          oldTopics: [],
          options: topics,
        };
        changeTopics(settings, topicRef);
      }
    }
  }, [topics, state.client, topicRef.current?.length, clientRef]);

  useEffect(() => {
    if ((topics && topics.length) || (!state.client && topics)) {
      startMqtt(topics, setState, clientRef, topicRef);
    }
    return () => {
      stopMqtt(clientRef.current, topicRef.current);
    };
  }, [topicsFound]); // mqtt won't really start without topics

  if (!stopsFetched || !stationsFetched) {
    return <Loading />;
  }
  return (
    <CarouselContainer
      stopDepartures={stopDepartures}
      stationDepartures={stationDepartures}
      alerts={alerts}
      preview={preview}
      closedStopViews={closedStopViews}
      trainsWithTrack={trainsWithTrack}
      topics={topics}
      messages={state.messages}
      clientRef={clientRef}
      topicRef={topicRef}
      vehicleMarkerState={vehicleMarkerState}
      setVehicleMarkerState={setVehicleMarkerState}
    />
  );
};

function getMqttTopics(
  views,
  mapSettings,
  stationDepartures,
  stopDepartures,
  trainsWithTrack,
) {
  let initialTopics = [];

  if (mapSettings?.showMap) {
    // Todo. This is a hacky solution to easiest way of figuring out all the departures.
    // Map keeps record of all it's stops, so it has all their departures. This should be done
    // more coherent way when there is time.
    const allDep = [];

    for (let i = 0; i < views.length; i++) {
      const element = [
        sortAndFilter(
          [...stationDepartures[i][0], ...stopDepartures[i][0]],
          trainsWithTrack,
        ),
        sortAndFilter(
          [...stationDepartures[i][1], ...stopDepartures[i][1]],
          trainsWithTrack,
        ),
      ];
      allDep.push(element);
    }

    const mapDepartures = allDep
      .map(o => o.flatMap(a => a))
      .reduce((a, b) => (a.length > b.length ? a : b));
    initialTopics = mapDepartures
      .filter(t => t.realtime)
      .map(dep => {
        const feedId = dep.trip.gtfsId.split(':')[0];
        const topic = {
          feedId: feedId,
          route: dep.trip.route?.gtfsId?.split(':')[1],
          tripId: dep.trip.gtfsId.split(':')[1],
          shortName: dep.trip.route.shortName,
          type: 3,
          ...dep,
        };
        if (feedId.toLowerCase() === 'hsl') {
          const i = dep.stops.findIndex(d => dep.stop.gtfsId === d.gtfsId);
          if (i !== dep.stops.length - 1) {
            const additionalStop = dep.stops[i + 1];
            topic.additionalStop = additionalStop;
          }
        }
        return topic;
      });
  }
  const topics = initialTopics;
  initialTopics.forEach(t => {
    if (t.additionalStop) {
      const additionalTopic = {
        ...t,
        stop: t.additionalStop,
        additionalStop: null,
      };
      topics.push(additionalTopic);
    }
  });
  return topics;
}

export default CarouselDataContainer;
