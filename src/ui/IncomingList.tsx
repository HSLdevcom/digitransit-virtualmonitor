import * as React from "react";
import { InjectedTranslateProps, translate } from 'react-i18next';

import {
  formatTime,
  parseDaySeconds,
} from "src/time";
import { IStopTime } from 'src/ui/StopIncomingRetriever'

export interface IStopIncomingListProps {
  readonly stoptimesWithoutPatterns: ReadonlyArray<IStopTime>,
};

const IncomingRow = ({ stoptime } : { stoptime: IStopTime }) => (
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

const IncomingList = ({ stoptimesWithoutPatterns, t } : IStopIncomingListProps & InjectedTranslateProps) => (
  <table className={'IncomingList'}>
    <thead>
      <tr>
        <th className={'departureTime'}>{t('departureTime')}</th>
        <th className={'lineId'}>{t('lineId')}</th>
        <th className={'destination'}>{t('destination')}</th>
      </tr>
    </thead>
    <tbody>
      {stoptimesWithoutPatterns.map(stoptime => (
        <IncomingRow
          stoptime={stoptime}
          key={stoptime.trip.gtfsId}
        />
      ))}
    </tbody>
  </table>
);

export default translate('translations')(IncomingList);
