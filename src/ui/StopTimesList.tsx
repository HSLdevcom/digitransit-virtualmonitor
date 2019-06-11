import * as React from "react";
import { InjectedTranslateProps, translate } from 'react-i18next';
import StopName from "src/ui/StopName";
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
  readonly showStopColumn?: boolean,
};

interface IStopTimesListHeadersProps {
  readonly pierColumnTitle?: string,
  readonly showPier?: boolean,
  readonly showStopColumn?: boolean,
};

const StopTimesListHeaders = ({ pierColumnTitle, showPier, t, showStopColumn }: IStopTimesListHeadersProps & InjectedTranslateProps) => (
  <thead>
    <tr>
      <th className={'lineId'}>{t('lineId')}</th>
      <th className={'destination'}>{t('destination')}</th>
      {showPier
        ? (<th className={'pier'}>{pierColumnTitle ? pierColumnTitle : t('pier')}</th>)
        : null
      }
     {!showStopColumn 
       ? <th className={'destination'}> Pysäkki </th> 
       : null}
      <th className={'departureTime'}>{t('departureTime')}</th>
    </tr>
  </thead>
);
const StopTimesListHeadersTranslated = translate('translations')(StopTimesListHeaders);

const StopTimeRow = ({ stoptime, showPier, t, showStopColumn } : { stoptime: IStopTime & IOverrideStopName, showPier?: boolean, showStopColumn?: boolean, } & InjectedTranslateProps) => {
  const isCanceled = stoptime.realtimeState === 'CANCELED';
  console.log(showStopColumn)
  return (
    <tr
      className={isCanceled ? 'canceled' : ''}
    >
      <td
        className={'routeName'}
      >
        {stoptime.trip.route.shortName}
      </td>
      <td
        className={'destination'}
      >
        {isCanceled
          ? t('canceled')
          : stoptime.headsign
        }
      </td>
      {showPier
        ? (<td className={'pier'}>{(stoptime.stop && (stoptime.stop.overrideStopName || stoptime.stop.platformCode)) || ''}</td>)
        : null
      }
      {!showStopColumn ?
       <td className={'pier'}> {stoptime.stop === undefined ? 'not found' : <StopName stopIds={[stoptime.stop.gtfsId]} />}</td>
        :null}
      <td
        className={'time'}
      >
        {(stoptime.realtimeState && (stoptime.realtimeState !== 'SCHEDULED')) ? null : '~' }<time>{formatTime(parseDaySeconds(stoptime.usedTime))}</time>
      </td>
    </tr>
  );
};
const StopTimeRowTranslated = translate('translations')(StopTimeRow);

/* Separator row is used instead of just having bottom border since dashed borders between table cells look terrible. This looks ok. */
const SeparatorRow = ({ showPier, showStopColumn }: { showPier?: boolean, showStopColumn?: boolean, }) => (
  <tr
    className={"separator"}
  >
    <td
      colSpan={ showPier && showStopColumn ? 5 :  4}
    />
  </tr>
)

const StopTimesList = ({ pierColumnTitle, showPier, stoptimesWithoutPatterns, t, showStopColumn } : IStopTimesListProps & InjectedTranslateProps) => {
  const usedShowPier = (showPier !== undefined)
    ? showPier
    : stoptimesWithoutPatterns.some(stopTime => (
        (stopTime.stop !== undefined) &&
        (((stopTime.stop.overrideStopName !== undefined) && (stopTime.stop.overrideStopName !== null) && (stopTime.stop.overrideStopName !== '')) || ((stopTime.stop.platformCode !== undefined) && (stopTime.stop.platformCode !== null) && (stopTime.stop.platformCode !== '')))
      ));

  return (
    <table className={'StopTimesList'}>
      <StopTimesListHeadersTranslated
        pierColumnTitle={pierColumnTitle}
        showPier={usedShowPier}
        showStopColumn={showStopColumn}
      />
      <tbody>
        {stoptimesWithoutPatterns.map((stoptime, i) => (
          <React.Fragment
            key={`${stoptime.trip.gtfsId}-${(stoptime.stop && stoptime.stop.gtfsId) || ''}-fragment`}
          >
            <StopTimeRowTranslated
              stoptime={stoptime}
              showPier={usedShowPier}
              showStopColumn={showStopColumn}
            />
            {(i < (stoptimesWithoutPatterns.length - 1))
              ? <SeparatorRow
                  showPier={usedShowPier}
                  showStopColumn={showStopColumn}
                />
              : null
            }
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default translate('translations')(StopTimesList);
