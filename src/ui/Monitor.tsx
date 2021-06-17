import React, { FC, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import Titlebar from './Titlebar';
import TitlebarTime from './TitlebarTime';
import Logo from './logo/Logo';
import MonitorRowContainer from './MonitorRowContainer';
import { getLayout } from '../util/getLayout';
import { IMonitorConfig } from '../App';
import { IDeparture } from './MonitorRow';

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
          }
        }
      }
    }
  }
`;

interface IStop {
  code: string;
  desc: string;
  gtfsId: string;
  locationType: string;
  name: string;
  hiddenRoutes: Array<any>;
}
interface ISides {
  stops: Array<IStop>;
}
interface IColumn {
  left: ISides;
  right: ISides;
}
interface IView {
  columns: IColumn;
  title: string;
  layout: number;
  duration: number;
}
const getDeparturesWithoutHiddenRoutes = (stop, hiddenRoutes) => {
  const departures = [];
  stop.stoptimesForPatterns.forEach(stoptimeList => {
    if (!hiddenRoutes.includes(stoptimeList.pattern.code)) {
      departures.push(...stoptimeList.stoptimes);
    }
  });
  return departures;
};
interface IProps {
  readonly view: IView;
  readonly config: IMonitorConfig;
  readonly noPolling?: boolean;
  readonly index: number;
}
const Monitor: FC<IProps> = ({ view, index, config, noPolling }) => {
  const [monitorData, setMonitorData] = useState([]);
  const [skip, setSkip] = useState(false);
  const [stopDepartures, setStopDepartures] = useState([]);
  const [stationDepartures, setStationDepartures] = useState([]);
  const [stopsFetched, setStopsFetched] = useState(false);
  const [stationsFetched, setStationsFetched] = useState(false);

  const stationIds = [];
  const stopIds = [];
  // Don't poll on preview
  const pollInterval = noPolling ? 0 : 30000;
  view.columns.left.stops.forEach(stop =>
    stop.locationType === 'STOP'
      ? stopIds.push(stop.gtfsId)
      : stationIds.push(stop.gtfsId),
  );
  const { loading, error, data, previousData } = useQuery(GET_DEPARTURES, {
    variables: { ids: stopIds, numberOfDepartures: 24 },
    pollInterval: pollInterval,
    skip: skip,
  });
  const stationState = useQuery(GET_DEPARTURES_FOR_STATIONS, {
    variables: { ids: stationIds, numberOfDepartures: 24 },
    pollInterval: pollInterval,
    skip: skip,
  });
  useEffect(() => {
    if (monitorData[index]?.stations) {
      setSkip(true);
    }
  }, [monitorData])
  useEffect(() => {
    if (stationState.previousData?.stations) {
      const foo = monitorData;
      foo[index] = stationState.previousData;
      setMonitorData(foo);
      setTimeout(() => setSkip(false), pollInterval)
    }
  }, [stationState.previousData])
  useEffect(() => {
    if (data?.stops) {
      const departures: Array<IDeparture> = [];
      const stops = view.columns.left.stops;
      data.stops.forEach(stop => {
        let routesToHide: Array<string> = stops
          .find(s => {return s.gtfsId === stop.gtfsId})
          ?.hiddenRoutes.map(route => route.code);
        if (!routesToHide[0]) {
          routesToHide = [];
        }
        departures.push(
          ...getDeparturesWithoutHiddenRoutes(stop, routesToHide),
        );
      });
      setStopDepartures(departures);
      setStopsFetched(true);
    }
    if (!stopIds.length) {
      setStopsFetched(true);
    }
  }, [data]);
  useEffect(() => {
    if (stationState.data?.stations) {
      const stops = view.columns.left.stops;
      const departures: Array<IDeparture> = [];
      stationState.data.stations
        .filter(s => s)
        .forEach(station => {
          const routes = [];
          station.stops.forEach(stop => routes.push(...stop.routes));
          let routesToHide = stops
            .find(s => {return s.gtfsId === station.gtfsId})
            ?.hiddenRoutes.map(route => route.code);
            if (!routesToHide) {
              routesToHide = [];
            }
          const stationWithRoutes = {
            ...station,
            routes: routes,
          };
          departures.push(
            ...getDeparturesWithoutHiddenRoutes(
              stationWithRoutes,
              routesToHide,
            ),
          );
        });
      setStationDepartures(departures);
      setStationsFetched(true);
    }
    if (!stationIds.length) {
      setStopsFetched(true);
    }
  }, [stationState]);

  if (loading) {
    return <div>LOADING</div>;
  }
  return (
    <div className="main-content-container">
      {' '}
      <Titlebar>
        <Logo monitorConfig={config} />
        <div
          id={'title-text'}
          style={{
            fontSize: 'min(4vw, 4em)',
            justifyContent: 'center',
          }}
        >
          {view.title}
        </div>
        <TitlebarTime />
      </Titlebar>
      {stationsFetched && stopsFetched && (
        <MonitorRowContainer
          departures={[...stopDepartures, ...stationDepartures]}
          layout={getLayout(view.layout)}
        />
      )}
    </div>
  );
};

export default Monitor;
