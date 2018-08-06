import * as React from "react";
import { InjectedTranslateProps, translate } from 'react-i18next';

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
      <time>{formatTime(parseDaySeconds(stoptime.scheduledArrival))}</time>
    </td>
    <td>
      {stoptime.trip.route.shortName}
    </td>
    <td>
      {stoptime.headsign}
    </td>
  </tr>
);

const StopIncomingList = ({ stop, t } : IStopIncomingListProps & InjectedTranslateProps) => (
  <table className={'StopIncomingList'}>
    <thead>
      <tr>
        <th className={'departureTime'}>{t('departureTime')}</th>
        <th className={'lineId'}>{t('lineId')}</th>
        <th className={'destination'}>{t('destination')}</th>
      </tr>
    </thead>
    <tbody>
      {stop.stoptimesWithoutPatterns.map(stoptime => (
        <StopIncomingRow
          stoptime={stoptime}
          key={stoptime.trip.gtfsId}
        />
      ))}
    </tbody>
  </table>
);

export default translate('translations')(StopIncomingList);
