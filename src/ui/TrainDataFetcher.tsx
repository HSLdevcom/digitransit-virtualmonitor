import React, { FC, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import CarouselDataContainer from './CarouselDataContainer';
import Loading from './Loading';
import {
  getTodayWithFormat,
  utcToSeconds,
  formattedDateTimeFromSeconds,
  getTomorrowWithFormat,
} from '../time';
import { sortBy, uniqBy } from 'lodash';
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
      timeTableRows(where: $stations) {
        type
        scheduledTime
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
      timeTableRows(where: $stations) {
        type
        scheduledTime
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
  preview?: boolean;
  defaultLines?: any;
  stopAndRoutes?: any;
}

const TrainDataFetcher: FC<IProps> = ({
  preview = false,
  stopAndRoutes,
  defaultLines,
  ...rest
}) => {
  const shortCodes = stopAndRoutes
    .map(stop => {
      return {
        gtfsId: stop.parentStation,
        shortCode: stop?.shortCode || stop.parentStation.slice(-3),
      };
    })
    .filter(s => s);
  const s = uniqBy(shortCodes, 'shortCode');
  const stationsQuery = s
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
                  stopAndRoutes[
                    stopAndRoutes.findIndex(
                      x => x.shortCode === t.station.shortCode,
                    )
                  ]?.routes;
                if (routes?.indexOf(id) !== -1) {
                  idx = i;
                }
              });
            }
            // match rail api data to otp data with route.shortName and train.trainnumber .
            // these don't always fully match (ie. IC 149 -> 149) so check against the number.
            // OTP might return the data in either of the formats, rail api returns only the number.
            const line = Number.isInteger(parseInt(id))
              ? stopAndRoutes.find(el => el.routes.match(/\d+$/)?.[0] === id)
                  ?.routes
              : train.commuterLineid;
            trainsWithTrack.push({
              lineId: line,
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
