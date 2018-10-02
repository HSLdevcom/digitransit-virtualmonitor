import * as React from "react";
import { InjectedTranslateProps, translate } from 'react-i18next';

import {
  formatTime,
  parseDaySeconds,
} from "src/time";
import { IStopTime } from 'src/ui/StopTimesRetriever'

interface IOverrideStopName {
  readonly stop?: {
    readonly overrideStopName?: string,
  },
};

export interface IStopTimesListProps {
  readonly pierColumnTitle?: string,
  readonly stoptimesWithoutPatterns: ReadonlyArray<IStopTime & IOverrideStopName>,
  readonly showPier?: boolean,
};

interface IStopTimesListHeadersProps {
  readonly pierColumnTitle?: string,
  readonly showPier?: boolean,
};

const StopTimesListHeaders = ({ pierColumnTitle, showPier, t }: IStopTimesListHeadersProps & InjectedTranslateProps) => (
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
const StopTimesListHeadersTranslated = translate('translations')(StopTimesListHeaders);

const StopTimeRow = ({ stoptime, showPier } : { stoptime: IStopTime & IOverrideStopName, showPier?: boolean }) => (
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

const StopTimesList = ({ pierColumnTitle, showPier, stoptimesWithoutPatterns, t } : IStopTimesListProps & InjectedTranslateProps) => (
  <table className={'StopTimesList'}>
    <StopTimesListHeadersTranslated
      pierColumnTitle={pierColumnTitle}
      showPier={showPier}
    />
    <tbody>
      {stoptimesWithoutPatterns.map(stoptime => (
        <StopTimeRow
          stoptime={stoptime}
          key={`${stoptime.trip.gtfsId}-${(stoptime.stop && stoptime.stop.gtfsId) || ''}`}
          showPier={showPier}
        />
      ))}
    </tbody>
  </table>
);

export default translate('translations')(StopTimesList);
