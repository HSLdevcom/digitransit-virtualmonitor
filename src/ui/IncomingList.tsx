import * as React from "react";
import { InjectedTranslateProps, translate } from 'react-i18next';

import {
  formatTime,
  parseDaySeconds,
} from "src/time";
import { IStopTime } from 'src/ui/StopIncomingRetriever'

interface IOverrideStopName {
  stop?: {
    overrideStopName?: string,
  },
};

export interface IStopIncomingListProps {
  readonly pierColumnTitle?: string,
  readonly stoptimesWithoutPatterns: ReadonlyArray<IStopTime & IOverrideStopName>,
  readonly showPier?: boolean,
};
interface IIncomingHeadersProps {
  readonly pierColumnTitle?: string,
  readonly showPier?: boolean,
};

const IncomingHeaders = ({ pierColumnTitle, showPier, t }: IIncomingHeadersProps & InjectedTranslateProps) => (
  <thead>
    <tr>
      <th className={'departureTime'}>{t('departureTime')}</th>
      <th className={'lineId'}>{t('lineId')}</th>
      <th className={'destination'}>{t('destination')}</th>
      {showPier
        ? (<th className={'pier'}>{pierColumnTitle ? pierColumnTitle : t('pier')}</th>)
        : null
      }
    </tr>
  </thead>
);
const IncomingHeadersTranslated = translate('translations')(IncomingHeaders);

const IncomingRow = ({ stoptime, showPier } : { stoptime: IStopTime & IOverrideStopName, showPier?: boolean }) => (
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
        ? (<td className={'pier'}>{(stoptime.stop && (stoptime.stop.overrideStopName || stoptime.stop.platformCode)) || ''}</td>)
        : null
      }
  </tr>
);

const IncomingList = ({ pierColumnTitle, showPier, stoptimesWithoutPatterns, t } : IStopIncomingListProps & InjectedTranslateProps) => (
  <table className={'IncomingList'}>
    <IncomingHeadersTranslated
      pierColumnTitle={pierColumnTitle}
      showPier={showPier}
    />
    <tbody>
      {stoptimesWithoutPatterns.map(stoptime => (
        <IncomingRow
          stoptime={stoptime}
          key={`${stoptime.trip.gtfsId}-${(stoptime.stop && stoptime.stop.gtfsId) || ''}`}
          showPier={showPier}
        />
      ))}
    </tbody>
  </table>
);

export default translate('translations')(IncomingList);
