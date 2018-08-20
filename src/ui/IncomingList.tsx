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
interface IIncomingHeadersProps {
  showPier: boolean,
};
const IncomingHeaders = ({ showPier, t }: IIncomingHeadersProps & InjectedTranslateProps) => (
  <thead>
    <tr>
      <th className={'departureTime'}>{t('departureTime')}</th>
      <th className={'lineId'}>{t('lineId')}</th>
      <th className={'destination'}>{t('destination')}</th>
      {showPier
        ? (<th className={'pier'}>{t('pier')}</th>)
        : null
      }
    </tr>
  </thead>
);
const IncomingHeadersTranslated = translate('translations')(IncomingHeaders);

const IncomingRow = ({ stoptime, showPier } : { stoptime: IStopTime, showPier: boolean }) => (
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
    {showPier
        ? (<td className={'pier'}>1</td>)
        : null
      }
  </tr>
);

const IncomingList = ({ stoptimesWithoutPatterns, t } : IStopIncomingListProps & InjectedTranslateProps) => (
  <table className={'IncomingList'}>
    <IncomingHeadersTranslated showPier={true} />
    <tbody>
      {stoptimesWithoutPatterns.map(stoptime => (
        <IncomingRow
          stoptime={stoptime}
          key={stoptime.trip.gtfsId}
          showPier={true}
        />
      ))}
    </tbody>
  </table>
);

export default translate('translations')(IncomingList);
