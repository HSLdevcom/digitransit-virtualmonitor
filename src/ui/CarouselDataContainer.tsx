import React, {
  FC,
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
} from 'react';
import { useQuery } from '@apollo/client';
import {
  GetDeparturesForStopsDocument,
  GetDeparturesForStationsDocument,
} from '../generated';
import { getLayout } from '../util/getResources';
import { ITrainData, SetQueryError } from '../util/Interfaces';
import {
  getStopsAndStationsFromViews,
  createDepartureArray,
} from '../util/monitorUtils';
import Loading from './Loading';
import { uniqBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import CarouselContainer from './CarouselContainer';
import { MonitorContext } from '../contexts';
import {
  changeTopics,
  startMqtt,
  stopMqtt,
  getMqttTopics,
  setMqttTopics,
} from '../util/mqttUtils';
import { useMergeState } from '../util/utilityHooks';
import { ConfigContext } from '../contexts';

interface IProps {
  preview?: boolean;
  trainsWithTrack?: Array<ITrainData>;
  fromStop?: boolean;
  initTime: number;
  setQueryError?: SetQueryError;
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
  const [topicsFound, setTopicsFound] = useState(false);
  const [topicState, setTopicState] = useState({ topics: [], oldTopics: [] });
  const config = useContext(ConfigContext);

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

  const handleTopicStateChange = data => {
    setTopicState(data);
  };

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
      setAlerts(
        uniqBy(
          filterEffectiveAlerts(a),
          alert => alert.stop?.gtfsId + ':' + alert.alertHeaderText,
        ),
      );
      setStopsFetched(true);
      setClosedStopViews(closedStopViews);

      setMqttTopics(
        views,
        mapSettings,
        stationDepartures,
        newDepartureArray,
        trainsWithTrack,
        config,
        topicState,
        handleTopicStateChange,
      );
    }
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
      setAlerts(
        uniqBy(filterEffectiveAlerts(a), alert => alert.alertHeaderText),
      );
      setStationsFetched(true);

      setMqttTopics(
        views,
        mapSettings,
        newDepartureArray,
        stopDepartures,
        trainsWithTrack,
        config,
        topicState,
        handleTopicStateChange,
      );
    }
  }, [stationsState.data, forceUpdate]);
  useEffect(() => {
    // Force update interval for itineraries that need to be filtered by timeShift setting.
    const intervalId = setInterval(() => {
      setforceUpdate(prev => !prev);
    }, 1000 * 20);
    return () => clearInterval(intervalId);
  }, []);

  const topics = useMemo(
    () =>
      topicState.topics.length > 0
        ? topicState.topics
        : getMqttTopics(
            views,
            mapSettings,
            stationDepartures,
            stopDepartures,
            trainsWithTrack,
            config.rtVehicleOffsetSeconds,
          ),
    [
      topicState.topics,
      mapSettings,
      stationDepartures,
      stopDepartures,
      trainsWithTrack,
      config.rtVehicleOffsetSeconds,
    ],
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
  const cancelRef = useRef(false);
  const batchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [vehicleMarkerState, setVehicleMarkerState] = useState(new Map());

  const mqttStateHandler = data => {
    setState(data);
  };

  const markerHandler = markerData => {
    setVehicleMarkerState(markerData);
  };

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
  }, [topics, state.client, topicsFound]);

  useEffect(() => {
    cancelRef.current = false;
    if ((topics && topics.length) || (!state.client && topics)) {
      const result = startMqtt(
        topics,
        mqttStateHandler,
        clientRef,
        topicRef,
        cancelRef,
      );
      if (result) {
        result.then(id => {
          if (id !== null && id !== undefined) {
            batchIntervalRef.current = id;
          }
        });
      }
    }
    return () => {
      cancelRef.current = true;
      if (batchIntervalRef.current !== null) {
        clearInterval(batchIntervalRef.current);
        batchIntervalRef.current = null;
      }
      stopMqtt(clientRef.current, topicRef.current);
    };
  }, [topicsFound]); // mqtt won't really start without topics

  if (!stopsFetched || !stationsFetched) {
    return <Loading />;
  }

  const mqttProps = {
    newTopics: topics,
    messages: state.messages,
    clientRef,
    topicRef,
    vehicleMarkerState,
    setVehicleMarkerState: markerHandler,
  };

  return (
    <CarouselContainer
      stopDepartures={stopDepartures}
      stationDepartures={stationDepartures}
      alerts={alerts}
      preview={preview}
      closedStopViews={closedStopViews}
      trainsWithTrack={trainsWithTrack}
      mqttProps={mqttProps}
    />
  );
};

export default CarouselDataContainer;
