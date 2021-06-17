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
}
const getDeparturesWithoutHiddenRoutes = (stop, hiddenRoutes) => {
  const departures = [];
  console.log(hiddenRoutes);
  stop.stoptimesForPatterns.forEach(stoptimeList => {
    if (!hiddenRoutes.includes(stoptimeList.pattern.code)) {
      departures.push(...stoptimeList.stoptimes);
    }
  });
  return departures;
};
interface IProps {
  readonly view: Array<IView>;
  readonly config: IMonitorConfig;
  readonly noPolling?: boolean;
}
const Monitor: FC<IProps> = ({ view, config, noPolling }) => {
  const [stopDepartures, setStopDepartures] = useState([]);
  const [stationDepartures, setStationDepartures] = useState([]);
  const [stopsFetched, setStopsFetched] = useState(false);
  const [stationsFetched, setStationsFetched] = useState(false);

  const stationIds = [];
  const stopIds = [];
  // Don't poll on preview
  const pollInterval = noPolling ? 0 : 30000;
  view[0].columns.left.stops.forEach(stop =>
    stop.locationType === 'STOP'
      ? stopIds.push(stop.gtfsId)
      : stationIds.push(stop.gtfsId),
  );
  const { loading, error, data } = useQuery(GET_DEPARTURES, {
    variables: { ids: stopIds, numberOfDepartures: 24 },
    pollInterval: pollInterval,
  });
  const stationState = useQuery(GET_DEPARTURES_FOR_STATIONS, {
    variables: { ids: stationIds, numberOfDepartures: 24 },
    pollInterval: pollInterval,
  });
  useEffect(() => {
    if (data?.stops) {
      const departures: Array<IDeparture> = [];
      const stops = view[0].columns.left.stops;
      data.stops.forEach(stop => {
        const routesToHide: Array<string> = stops
          .find(s => s.gtfsId === stop.gtfsId)
          .hiddenRoutes.map(route => route.code);
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
      const stops = view[0].columns.left.stops;
      const departures: Array<IDeparture> = [];
      stationState.data.stations
        .filter(s => s)
        .forEach(stop => {
          const routes = [];
          stop.stops.forEach(stop => routes.push(...stop.routes));
          const routesToHide = stops
            .find(s => s.gtfsId === stop.gtfsId)
            .hiddenRoutes.map(route => route.code);
          const stationWithRoutes = {
            ...stop,
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
          {view[0].title}
        </div>
        <TitlebarTime />
      </Titlebar>
      {stationsFetched && stopsFetched && (
        <MonitorRowContainer
          departures={[...stopDepartures, ...stationDepartures]}
          layout={getLayout(view[0].layout)}
        />
      )}
    </div>
  );
};

export default Monitor;
