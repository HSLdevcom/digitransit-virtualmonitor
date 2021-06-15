import React, { FC, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import Titlebar from './Titlebar';
import TitlebarTime from './TitlebarTime';
import MonitorRowContainer from './MonitorRowContainer';
import { getLayout } from '../util/getLayout';

const GET_DEPARTURES = gql`
  query GetDepartures($ids: [String!]!, $numberOfDepartures: Int!) {
    stops: stops(ids: $ids) {
      name
      gtfsId
      routes {
        longName
        id
      }
      stoptimesForPatterns {
        stoptimes {
          trip {
            gtfsId
          }
        }
      }
      stoptimesWithoutPatterns(numberOfDepartures: $numberOfDepartures) {
        scheduledArrival
        realtimeArrival
        arrivalDelay
        scheduledDeparture
        realtimeDeparture
        departureDelay
        headsign
        trip {
          gtfsId
          stops {
            id
          }
          route {
            shortName
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
      stoptimesForPatterns {
        stoptimes {
          trip {
            gtfsId
          }
        }
      }
      stoptimesWithoutPatterns(numberOfDepartures: $numberOfDepartures) {
        scheduledArrival
        realtimeArrival
        arrivalDelay
        scheduledDeparture
        realtimeDeparture
        departureDelay
        headsign
        trip {
          gtfsId
          stops {
            id
          }
          route {
            shortName
          }
        }
      }
    }
  }
`;

interface IProps {
  readonly view: any;
}
const Monitor: FC<IProps> = ({ view }) => {
  const [stopDepartures, setStopDepartures] = useState([]);
  const [stationDepartures, setStationDepartures] = useState([]);
  const [stopsFetched, setStopsFetched] = useState(false);
  const [stationsFetched, setStationsFetched] = useState(false);

  const stationIds = [];
  const stopIds = [];
  console.log(view)
  view[0].columns.left.stops.forEach(stop =>
    stop.locationType === 'STOP'
      ? stopIds.push(stop.gtfsId)
      : stationIds.push(stop.gtfsId),
  );
  const { loading, error, data } = useQuery(GET_DEPARTURES, {
    variables: { ids: stopIds, numberOfDepartures: 12 },
    pollInterval: 10000,
  });
  const stationState = useQuery(GET_DEPARTURES_FOR_STATIONS, {
    variables: { ids: stationIds, numberOfDepartures: 12 },
    pollInterval: 10000,
  });
  useEffect(() => {
    if (data?.stops) {
      const departures = [];
      data.stops.forEach(stop =>
        departures.push(...stop.stoptimesWithoutPatterns),
      );
      //departures.sort((a,b) => a.realtimeDeparture - b.realtimeDeparture);
      setStopDepartures(departures);
      setStopsFetched(true);
    }
    if (!stopIds.length) {
      setStopsFetched(true);
    }
  }, [data]);
  useEffect(() => {
    if (stationState.data?.stations) {
      const departures = [];
      stationState.data.stations.forEach(stop =>
        departures.push(...stop.stoptimesWithoutPatterns),
      );
      //departures.sort((a,b) => a.realtimeDeparture - b.realtimeDeparture);
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
        {/* <Logo monitorConfig={monitorConfig} /> */}
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
