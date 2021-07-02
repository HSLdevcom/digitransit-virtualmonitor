import React, { FC, useState, useEffect } from 'react';
import { IView } from '../util/Interfaces';
import { gql, QueryResult, useQuery } from '@apollo/client';
import Titlebar from './Titlebar';
import TitlebarTime from './TitlebarTime';
import Logo from './logo/Logo';
import MonitorRowContainer from './MonitorRowContainer';
import { getLayout } from '../util/getLayout';
import { IMonitorConfig } from '../App';
import { IDeparture } from './MonitorRow';
import { EpochMilliseconds } from '../time';

const GET_DEPARTURES = gql`
  query GetDepartures($ids: [String!]!, $numberOfDepartures: Int!) {
    stops: stops(ids: $ids) {
      name
      gtfsId
      routes {
        longName
        id
      }
      stoptimesForPatterns(numberOfDepartures: $numberOfDepartures) {
        pattern {
          code
          route {
            gtfsId
          }
        }
        stoptimes {
          stop {
            gtfsId
          }
          realtime
          pickupType
          serviceDay
          scheduledArrival
          realtimeArrival
          arrivalDelay
          scheduledDeparture
          realtimeDeparture
          departureDelay
          headsign
          trip {
            gtfsId
            route {
              shortName
            }
            stops {
              gtfsId
            }
          }
        }
      }
    }
  }
`;

const GET_DEPARTURES_FOR_STATIONS = gql`
  query GetDeparturesForStations($ids: [String!]!, $numberOfDepartures: Int!) {
    stations: stations(ids: $ids) {
      name
      gtfsId
      routes {
        longName
        id
      }
      stops {
        routes {
          gtfsId
        }
      }
      stoptimesForPatterns(numberOfDepartures: $numberOfDepartures) {
        pattern {
          code
          route {
            gtfsId
          }
        }
        stoptimes {
          stop {
            gtfsId
          }
          realtime
          pickupType
          serviceDay
          scheduledArrival
          realtimeArrival
          arrivalDelay
          scheduledDeparture
          realtimeDeparture
          departureDelay
          headsign
          trip {
            gtfsId
            route {
              shortName
            }
            stops {
              gtfsId
            }
          }
        }
      }
    }
  }
`;

const getDeparturesWithoutHiddenRoutes = (stop, hiddenRoutes) => {
  const departures = [];
  stop.stoptimesForPatterns.forEach(stoptimeList => {
    if (!hiddenRoutes.includes(stoptimeList.pattern.code)) {
      departures.push(...stoptimeList.stoptimes);
    }
  });
  return departures;
};

const loopStops = (data, stops) => {
  const departures: Array<IDeparture> = [];
  data.stops.forEach(stop => {
    let routesToHide: Array<string> = stops.find(s => {
      return s.gtfsId === stop.gtfsId;
    })?.settings?.hiddenRoutes;
    if (!routesToHide || !routesToHide[0]) {
      routesToHide = [];
    }
    const stoptimes: Array<any> = stops.find(s => {
      return s.gtfsId === stop.gtfsId;
    })?.stoptimes;
    departures.push(...getDeparturesWithoutHiddenRoutes(stop, routesToHide));
  });
  return departures;
};

const loopStations = (data, stops) => {
  const departures: Array<IDeparture> = [];
  data.stations
    .filter(s => s)
    .forEach(station => {
      const routes = [];
      station.stops.forEach(stop => routes.push(...stop.routes));
      let routesToHide = stops.find(s => {
        return s.gtfsId === station.gtfsId;
      })?.settings.hiddenRoutes;
      if (!routesToHide || !routesToHide[0]) {
        routesToHide = [];
      }
      const stationWithRoutes = {
        ...station,
        routes: routes,
      };
      departures.push(
        ...getDeparturesWithoutHiddenRoutes(stationWithRoutes, routesToHide),
      );
    });
  return departures;
};
interface IProps {
  readonly view: IView;
  readonly config: IMonitorConfig;
  readonly noPolling?: boolean;
  readonly index: number;
  readonly time?: EpochMilliseconds;
  readonly isPreview: boolean;
  readonly isLandscape: boolean;
}
const Monitor: FC<IProps> = ({
  view,
  index,
  config,
  noPolling,
  time,
  isPreview,
  isLandscape,
}) => {
  const [skip, setSkip] = useState(false);
  const [stopDataLeft, setStopDataLeft] = useState([]);
  const [stopDataRight, setStopDataRight] = useState([]);
  const [stationDataLeft, setStationDataLeft] = useState([]);
  const [stationDataRight, setStationDataRight] = useState([]);
  const [stopDeparturesLeft, setStopDeparturesLeft] = useState([]);
  const [stopDeparturesRight, setStopDeparturesRight] = useState([]);
  const [stationDeparturesLeft, setStationDeparturesLeft] = useState([]);
  const [stationDeparturesRight, setStationDeparturesRight] = useState([]);
  const [stopsFetched, setStopsFetched] = useState(false);
  const [stationsFetched, setStationsFetched] = useState(false);

  // Don't poll on preview
  const pollInterval = noPolling ? 0 : 30000;
  const isMultiDisplay = getLayout(view.layout)[2];

  const stopIdsLeft = [];
  const stopIdsRight = [];
  const stationIdsLeft = [];
  const stationIdsRight = [];

  view.columns.left.stops.forEach(stop => {
    stop.locationType === 'STOP'
      ? stopIdsLeft.push(stop.gtfsId)
      : stationIdsLeft.push(stop.gtfsId);
  });

  if (isMultiDisplay) {
    view.columns.right.stops.forEach(stop => {
      stop.locationType === 'STOP'
        ? stopIdsRight.push(stop.gtfsId)
        : stationIdsRight.push(stop.gtfsId);
    });
  }

  const stopStateLeft = useQuery(GET_DEPARTURES, {
    variables: { ids: stopIdsLeft, numberOfDepartures: 24 },
    pollInterval: pollInterval,
    skip: skip,
  });

  const stationStateLeft = useQuery(GET_DEPARTURES_FOR_STATIONS, {
    variables: { ids: stationIdsLeft, numberOfDepartures: 24 },
    pollInterval: pollInterval,
    skip: skip,
  });

  const stopStateRight = useQuery(GET_DEPARTURES, {
    variables: { ids: stopIdsRight, numberOfDepartures: 24 },
    pollInterval: pollInterval,
    skip: !isMultiDisplay || skip,
  });

  const stationStateRight = useQuery(GET_DEPARTURES_FOR_STATIONS, {
    variables: { ids: stationIdsRight, numberOfDepartures: 24 },
    pollInterval: pollInterval,
    skip: !isMultiDisplay || skip,
  });

  useEffect(() => {
    if (stopDataLeft[index]?.stops) {
      setSkip(true);
    }
  }, [stopDataLeft]);

  useEffect(() => {
    if (stopDataRight[index]?.stops) {
      setSkip(true);
    }
  }, [stopDataRight]);

  useEffect(() => {
    if (stationDataLeft[index]?.stations) {
      setSkip(true);
    }
  }, [stationDataLeft]);

  useEffect(() => {
    if (stationDataRight[index]?.stations) {
      setSkip(true);
    }
  }, [stationDataRight]);

  useEffect(() => {
    if (stopStateLeft.previousData?.stations) {
      const currentData = stopDataLeft;
      currentData[index] = stopStateLeft.previousData;
      setStopDataLeft(currentData);
      setTimeout(() => setSkip(false), pollInterval);
    }
  }, [stopStateLeft?.previousData]);

  useEffect(() => {
    if (isMultiDisplay && stopStateRight.previousData?.stations) {
      const currentData = stopDataRight;
      currentData[index] = stopStateRight.previousData;
      setStopDataRight(currentData);
      setTimeout(() => setSkip(false), pollInterval);
    }
  }, [stopStateRight?.previousData]);

  useEffect(() => {
    if (stationStateLeft.previousData?.stations) {
      const currentData = stationDataLeft;
      currentData[index] = stationStateLeft.previousData;
      setStationDataLeft(currentData);
      setTimeout(() => setSkip(false), pollInterval);
    }
  }, [stationStateLeft?.previousData]);

  useEffect(() => {
    if (isMultiDisplay && stationStateRight.previousData?.stations) {
      const currentData = stationDataRight;
      currentData[index] = stationStateRight.previousData;
      setStationDataRight(currentData);
      setTimeout(() => setSkip(false), pollInterval);
    }
  }, [stationStateRight?.previousData]);

  useEffect(() => {
    if (stopStateLeft.data?.stops) {
      const departures: Array<IDeparture> = loopStops(
        stopStateLeft.data,
        view.columns.left.stops,
      );
      setStopDeparturesLeft(departures);
      setStopsFetched(!isMultiDisplay ? true : false);
    }
    if (!stopIdsLeft.length) {
      setStopsFetched(!isMultiDisplay ? true : false);
    }
  }, [stopStateLeft]);

  useEffect(() => {
    if (isMultiDisplay && stopStateRight.data?.stops) {
      const departures: Array<IDeparture> = loopStops(
        stopStateRight.data,
        view.columns.right.stops,
      );
      setStopDeparturesRight(departures);
      setStopsFetched(true);
    }
    if (isMultiDisplay && !stopIdsRight.length) {
      setStopsFetched(true);
    }
  }, [stopStateRight]);

  useEffect(() => {
    if (stationStateLeft.data?.stations) {
      const departures: Array<IDeparture> = loopStations(
        stationStateLeft.data,
        view.columns.left.stops,
      );
      setStationDeparturesLeft(departures);
      setStationsFetched(isMultiDisplay ? false : true);
    }
    if (!stationIdsLeft.length) {
      setStationsFetched(isMultiDisplay ? false : true);
    }
  }, [stationStateLeft]);

  useEffect(() => {
    if (isMultiDisplay && stationStateRight.data?.stations) {
      const departures: Array<IDeparture> = loopStations(
        stationStateRight.data,
        view.columns.right.stops,
      );
      setStationDeparturesRight(departures);
      setStationsFetched(true);
    }
    if (isMultiDisplay && !stationIdsRight.length) {
      setStationsFetched(true);
    }
  }, [stationStateRight]);

  const loading = !isMultiDisplay
    ? stopStateLeft.loading || stationStateLeft.loading
    : stopStateLeft.loading ||
      stopStateRight.loading ||
      stationStateLeft.loading ||
      stationStateRight.loading;

  if (loading) {
    return <div>LOADING</div>;
  }
  const currentTime = time ? time : new Date().getTime();
  return (
    <div className="main-content-container">
      <Titlebar isPreview isLandscape>
        <Logo monitorConfig={config} isPreview isLandscape />
        {!isMultiDisplay && <div className="title-text">{view.title}</div>}
        {isMultiDisplay && (
          <div className="multi-display-titles">
            <div className="left-title">{view.columns.left.title}</div>
            <div className="right-title">{view.columns.right.title}</div>
          </div>
        )}
        <TitlebarTime
          currentTime={currentTime}
          updateInterval={noPolling ? 0 : 20000}
          isPreview
          isLandscape
        />
      </Titlebar>
      {stationsFetched && stopsFetched && (
        <MonitorRowContainer
          departuresLeft={[...stopDeparturesLeft, ...stationDeparturesLeft]}
          departuresRight={[...stopDeparturesRight, ...stationDeparturesRight]}
          layout={getLayout(view.layout)}
          // leftTitle={view.columns.left.title}
          // rightTitle={view.columns.right.title}
          isPreview={isPreview}
          isLandscape={isLandscape}
        />
      )}
    </div>
  );
};

export default Monitor;
