import React, { FC, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_STOP_DEPARTURES,
  GET_STATION_DEPARTURES,
} from '../queries/departureQueries';
import {
  GetDeparturesForStations,
  GetDeparturesForStationsVariables,
} from '../generated/GetDeparturesForStations';
import {
  GetDeparturesForStops,
  GetDeparturesForStopsVariables,
} from '../generated/GetDeparturesForStops';
import { getLayout } from '../util/getLayout';
import { IView, ITrainData } from '../util/Interfaces';
import {
  getStopsAndStationsFromViews,
  createDepartureArray,
} from '../util/monitorUtils';
import TranslationContainer from './TranslationContainer';
import Loading from './Loading';
import { uniq, uniqBy } from 'lodash';
import { WithTranslation, withTranslation } from 'react-i18next';
import CarouselContainer from './CarouselContainer';
interface IProps {
  views: Array<IView>;
  languages: Array<string>;
  preview?: boolean;
  error?: string;
  trainsWithTrack?: Array<ITrainData>;
  staticContentHash?: string;
  staticUrl?: string;
  staticViewTitle?: string;
}

const CarouselDataContainer: FC<IProps & WithTranslation> = ({
  views,
  languages,
  preview,
  error,
  t,
  trainsWithTrack,
  staticContentHash,
  staticUrl,
  staticViewTitle,
}) => {
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
  const [translationIds, setTranslationIds] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [closedStopViews, setClosedStopViews] = useState([]);

  const stationsState = useQuery<
    GetDeparturesForStations,
    GetDeparturesForStationsVariables
  >(GET_STATION_DEPARTURES, {
    variables: { ids: stationIds, numberOfDepartures: largest },
    pollInterval: pollInterval,
    skip: stationIds.length < 1,
    context: { clientName: 'default' },
  });

  const stopsState = useQuery<
    GetDeparturesForStops,
    GetDeparturesForStopsVariables
  >(GET_STOP_DEPARTURES, {
    variables: { ids: stopIds, numberOfDepartures: largest },
    pollInterval: pollInterval,
    skip: stopIds.length < 1,
    context: { clientName: 'default' },
  });

  useEffect(() => {
    const stops = stopsState?.data?.stops;
    if (stops?.length > 0) {
      const [stringsToTranslate, newDepartureArray, a, closedStopViews] =
        createDepartureArray(views, stops, false, t);
      setTranslationIds(translationIds.concat(stringsToTranslate));
      setStopDepartures(newDepartureArray);
      const arr = alerts.concat(a);
      setAlerts(uniqBy(arr, alert => alert.alertHeaderText));
      setStopsFetched(true);
      setClosedStopViews(closedStopViews);
    }
  }, [stopsState]);

  useEffect(() => {
    const stations = stationsState?.data?.stations;
    if (stations?.length > 0) {
      const [stringsToTranslate, newDepartureArray, a] = createDepartureArray(
        views,
        stations,
        true,
        t,
      );
      setTranslationIds(translationIds.concat(stringsToTranslate));
      setStationDepartures(newDepartureArray);
      const arr = alerts.concat(a);
      setAlerts(uniqBy(arr, alert => alert.alertHeaderText));
      setStationsFetched(true);
    }
  }, [stationsState]);

  if (!stopsFetched || !stationsFetched) {
    return <Loading />;
  }

  if (languages.indexOf('sv') !== -1) {
    return (
      <TranslationContainer
        languages={languages}
        translationIds={uniq(translationIds)}
        stopDepartures={stopDepartures}
        stationDepartures={stationDepartures}
        alerts={alerts}
        views={views}
        preview={preview}
        closedStopViews={closedStopViews}
        trainsWithTrack={trainsWithTrack}
        staticContentHash={staticContentHash}
        staticUrl={staticUrl}
        staticViewTitle={staticViewTitle}
      />
    );
  }

  return (
    <CarouselContainer
      languages={languages}
      stopDepartures={stopDepartures}
      stationDepartures={stationDepartures}
      alerts={alerts}
      views={views}
      preview={preview}
      closedStopViews={closedStopViews}
      error={error}
      trainsWithTrack={trainsWithTrack}
      staticContentHash={staticContentHash}
      staticUrl={staticUrl}
      staticViewTitle={staticViewTitle}
    />
  );
};

export default withTranslation('translations')(CarouselDataContainer);
