import React, { FC, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import CarouselDataContainer from './CarouselDataContainer';
import { IMonitor, ICard } from '../util/Interfaces';
import Loading from './Loading';
import {
  getTodayWithFormat,
  utcToSeconds,
  formattedDateTimeFromSeconds,
  getTomorrowWithFormat,
} from '../time';
import { sortBy, uniqBy } from 'lodash';
import { trainStationMap } from '../util/trainStations';
import { ITrainData } from '../util/Interfaces';

const GET_TRACKS = gql`
  query getTracks(
    $dateToday: Date!
    $dateTomorrow: Date!
    $trainClause: TrainWhere!
    $stations: TimeTableRowWhere!
  ) @api(contextKey: "clientName") {
    today: trainsByDepartureDate(
      departureDate: $dateToday
      where: $trainClause
    ) {
      commuterLineid
      trainNumber
      timetableType
      runningCurrently
      timeTableRows(where: $stations) {
        commercialStop
        type
        scheduledTime
        trainStopping
        actualTime
        commercialTrack
        station {
          shortCode
        }
      }
    }
    tomorrow: trainsByDepartureDate(
      departureDate: $dateTomorrow
      where: $trainClause
    ) {
      commuterLineid
      trainNumber
      timetableType
      runningCurrently
      timeTableRows(where: $stations) {
        commercialStop
        type
        scheduledTime
        trainStopping
        actualTime
        commercialTrack
        station {
          shortCode
        }
      }
    }
  }
`;
// There could be almost two identical rows
// (difference only in track - one with number and one with null)
const removeDuplicatesWithDifferentTracks = (
  trainsWithTrack,
): Array<ITrainData> => {
  const trains = trainsWithTrack;
  const result: Array<ITrainData> = [];
  trainsWithTrack.forEach((train, index) => {
    const possibleDuplicates = trainsWithTrack.filter(
      train =>
        train.lineId === trains[index].lineId &&
        train.timeInSecs === trains[index].timeInSecs,
    );
    if (possibleDuplicates.length > 1) {
      result.push(...possibleDuplicates.filter(d => d.track !== null));
    } else {
      result.push(...possibleDuplicates);
    }
  });
  return Array.from(new Set(result));
};
interface IProps {
  monitor: IMonitor;
  stations?: Array<ICard>;
  stops?: Array<ICard>;
  preview?: boolean;
  defaultLines?: any;
  stopAndRoutes?: any;
}

const TrainDataFetcher: FC<IProps> = ({
  monitor,
  stations,
  stops,
  preview = false,
  stopAndRoutes,
  defaultLines,
  ...rest
}) => {
  const ids = stations.concat(stops).map(st => st.gtfsId);
  const shortCodes = ids
    .map(id => {
      return {
        gtfsId: id,
        shortCode:
          trainStationMap?.find(i => i.gtfsId === id)?.shortCode ||
          id.substring(8),
      };
    })
    .filter(s => s);

  const stationsQuery = shortCodes
    .filter(a => a)
    .map(s => {
      return { station: { shortCode: { equals: s.shortCode } } };
    });
  const { data, loading } = useQuery(GET_TRACKS, {
    variables: {
      stations: {
        and: [{ type: { equals: 'DEPARTURE' } }, { or: stationsQuery }],
      },
      trainClause: {
        and: [
          {
            or: [
              {
                trainType: {
                  trainCategory: { name: { equals: 'Commuter' } },
                },
              },
              {
                trainType: {
                  trainCategory: { name: { equals: 'Long-distance' } },
                },
              },
            ],
          },
          { or: defaultLines },
        ],
      },
      dateToday: getTodayWithFormat('yyyy-MM-dd'),
      dateTomorrow: getTomorrowWithFormat('yyyy-MM-dd'),
    },
    context: { clientName: 'rail' },
  });
  const [trainsWithTrack, setTrainsWithTrack] = useState([]);

  useEffect(() => {
    if (data) {
      const srArray = Object.keys(stopAndRoutes).map(i => stopAndRoutes[i]);
      const trainsWithTrack = [];
      ['today', 'tomorrow'].forEach(day => {
        data[day].forEach(train => {
          if (train.timeTableRows !== null) {
            const id =
              train.commuterLineid === ''
                ? train.trainNumber.toString()
                : train.commuterLineid;
            let idx = 0;
            if (train.timeTableRows.length > 1) {
              train.timeTableRows.forEach((t, i) => {
                const routes =
                  srArray[
                    srArray.findIndex(x => x.shortCode === t.station.shortCode)
                  ]?.routes;
                if (routes?.indexOf(id) !== -1) {
                  idx = i;
                }
              });
            }
            trainsWithTrack.push({
              lineId: train.commuterLineid,
              trainNumber: train.trainNumber,
              time: formattedDateTimeFromSeconds(
                utcToSeconds(train.timeTableRows[idx].scheduledTime),
                'yyyy-MM-dd HH:mm:ss',
              ),
              timeInSecs: utcToSeconds(train.timeTableRows[idx].scheduledTime),
              track: train.timeTableRows[idx].commercialTrack,
            });
          }
        });
      });
      setTrainsWithTrack(trainsWithTrack);
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  }

  return (
    <CarouselDataContainer
      views={monitor.cards}
      languages={monitor.languages}
      trainsWithTrack={removeDuplicatesWithDifferentTracks(
        sortBy(trainsWithTrack, 'timeInSecs'),
      )}
      preview={preview}
      initTime={new Date().getTime()}
      {...rest}
    />
  );
};

export default TrainDataFetcher;
