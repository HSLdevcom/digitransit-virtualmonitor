import * as React from "react";
import {
  formatTime,
  parseDaySeconds,
} from "src/time";
import { IStop, IStopTime } from 'src/ui/StopIncomingRetriever'

export interface IStopIncomingListProps {
  stop: IStop,
}

const StopIncomingRow = ({ stoptime } : { stoptime: IStopTime }) => (
  <tr>
    <td>
      {formatTime(parseDaySeconds(stoptime.scheduledArrival))}
    </td>
    <td>
      {stoptime.trip.route.shortName}
    </td>
    <td>
      {stoptime.headsign}
    </td>
  </tr>
)

const StopIncomingList = (props: IStopIncomingListProps) => (
  <table className={'StopIncomingList'}>
    <thead>
      <tr>
        <th className={'departureTime'}>Lähtöaika</th>
        <th className={'lineId'}>Linja</th>
        <th className={'destination'}>Määränpää</th>
      </tr>
    </thead>
    <tbody>
      {props.stop.stoptimesWithoutPatterns.map(stoptime => (
        <StopIncomingRow stoptime={stoptime} />
      ))}
    </tbody>
  </table>
);

export default StopIncomingList;
