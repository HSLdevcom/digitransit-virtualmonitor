import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { formatTime, parseDaySeconds } from '../time';
import StopName from './StopName';
import { IStopTime } from './StopTimesRetriever';

interface IOverrideStopName {
  readonly stop?: {
    readonly overrideStopName?: string;
  };
}

export interface IStopTimesListProps {
  readonly pierColumnTitle?: string;
  readonly stoptimesWithoutPatterns: ReadonlyArray<
    IStopTime & IOverrideStopName
  >;
  readonly showPier?: boolean;
  readonly showStopColumn?: boolean;
}

interface IStopTimesListHeadersProps {
  readonly pierColumnTitle?: string;
  readonly showPier?: boolean;
  readonly showStopColumn?: boolean;
}

const StopTimesListHeaders = ({
  pierColumnTitle,
  showPier,
  showStopColumn,
  t,
}: IStopTimesListHeadersProps & WithTranslation) => (
  <thead>
    <tr>
      <th className={'lineId'}>{t('lineId')}</th>
      <th className={'destination'}>{t('destination')}</th>
      {showPier ? (
        <th className={'pier'}>
          {pierColumnTitle ? pierColumnTitle : t('pier')}
        </th>
      ) : null}
      {showStopColumn ? <th className={'destination'}>Pysäkki</th> : null}
      <th className={'departureTime'}>{t('departureTime')}</th>
    </tr>
  </thead>
);
const StopTimesListHeadersTranslated =
  withTranslation('translations')(StopTimesListHeaders);

const StopTimeRow = ({
  stoptime,
  showPier,
  showStopColumn,
  stopTimesRowsLen,
  t,
}: {
  stoptime: IStopTime & IOverrideStopName;
  showPier?: boolean;
  showStopColumn?: boolean;
  stopTimesRowsLen?: number;
} & WithTranslation) => {
  const isCanceled = stoptime.realtimeState === 'CANCELED';

  // If the Vehicle is arriving to its' destination, its headsign is null, or headsign is stop's name.
  // Check that the vehicle is arriving, and that the stop is indeed last stop of the route.
  let isLastStopTerminal = false;
  const isArrival = stoptime.pickupType === 'NONE';
  if (stoptime.trip && stoptime.trip.stops) {
    const lastStop = stoptime.trip.stops.slice(-1).pop();
    if (lastStop && stoptime.stop) {
      isLastStopTerminal = stoptime.stop.id === lastStop.id && isArrival;
    }
  }

  const headsign = stoptime.headsign;
  const noEmptyVia =
    headsign && headsign.endsWith(' via')
      ? headsign.substring(0, headsign.indexOf(' via'))
      : headsign;

  const splitDestination = noEmptyVia && noEmptyVia.includes(' via');
  const splittedDestination = splitDestination
    ? noEmptyVia.substring(0, noEmptyVia.indexOf(' via'))
    : noEmptyVia;
  const viaDestination = splitDestination
    ? noEmptyVia.substring(noEmptyVia.indexOf(' via') + 1)
    : undefined;

  const destination = isLastStopTerminal
    ? t('arriveTerminal')
    : splittedDestination;

  let className = isCanceled ? 'canceled ' : '';
  if (stopTimesRowsLen) {
    switch (stopTimesRowsLen) {
      case 6:
        className = className.concat('six-rows');
        break;
      case 5:
        className = className.concat('five-rows');
        break;
      case 4:
        className = className.concat('four-rows');
        break;
      case 3:
        className = className.concat('three-rows');
        break;
      case 2:
        className = className.concat('two-rows');
        break;
      case 1:
        className = className.concat('one-row');
    }
  }
  if (showStopColumn && stopTimesRowsLen && stopTimesRowsLen < 6) {
    className = className.concat(' with-pier');
  }

  return (
    <tr className={className}>
      <td className={'routeName'}>{stoptime.trip.route.shortName}</td>
      <td
        className={
          viaDestination && stopTimesRowsLen > 4
            ? 'destination'
            : 'destination-two-rows'
        }
      >
        {isCanceled ? t('canceled') : destination}
        {viaDestination && stopTimesRowsLen <= 4 ? (
          <span>{viaDestination}</span>
        ) : null}
        {viaDestination && stopTimesRowsLen > 4 ? (
          <span> {viaDestination}</span>
        ) : null}
      </td>
      {showPier ? (
        <td className={'pier'}>
          {(stoptime.stop &&
            (stoptime.stop.overrideStopName || stoptime.stop.platformCode)) ||
            ''}
        </td>
      ) : null}
      {showStopColumn ? (
        <td className={'pier'}>
          {stoptime.stop === undefined ? (
            'not found'
          ) : (
            <StopName stopIds={[stoptime.stop.gtfsId]} />
          )}
        </td>
      ) : null}
      <td className={'duration'}>
        {stoptime.realtimeState && stoptime.realtimeState !== 'SCHEDULED'
          ? null
          : '~'}
        <time>{formatTime(parseDaySeconds(stoptime.usedTime))}</time>
      </td>
    </tr>
  );
};
const StopTimeRowTranslated = withTranslation('translations')(StopTimeRow);

/* Separator row is used instead of just having bottom border since dashed borders between table cells look terrible. This looks ok. */
const SeparatorRow = ({
  showPier,
  showStopColumn,
}: {
  showPier?: boolean;
  showStopColumn?: boolean;
}) => (
  <tr className={'separator'}>
    <td colSpan={showPier ? 6 : showStopColumn ? 5 : 4} />
  </tr>
);

const StopTimesList = ({
  pierColumnTitle,
  showPier,
  stoptimesWithoutPatterns,
  t,
  showStopColumn,
}: IStopTimesListProps & WithTranslation) => {
  const usedShowPier =
    showPier !== undefined
      ? showPier
      : stoptimesWithoutPatterns.some(
          stopTime =>
            stopTime.stop !== undefined &&
            ((stopTime.stop.overrideStopName !== undefined &&
              stopTime.stop.overrideStopName !== null &&
              stopTime.stop.overrideStopName !== '') ||
              (stopTime.stop.platformCode !== undefined &&
                stopTime.stop.platformCode !== null &&
                stopTime.stop.platformCode !== '')),
        );
  let stopTimesRowsLen = stoptimesWithoutPatterns.length;
  // if via-word founds from one of destination then shrink text
  if (stoptimesWithoutPatterns.some(s => s.headsign.includes(' via'))) {
    stopTimesRowsLen += 1;
  }
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
            key={`${stoptime.trip.gtfsId}-${
              (stoptime.stop && stoptime.stop.gtfsId) || ''
            }-fragment`}
          >
            <StopTimeRowTranslated
              stoptime={stoptime}
              showPier={usedShowPier}
              showStopColumn={showStopColumn}
              stopTimesRowsLen={stopTimesRowsLen}
            />
            {i < stoptimesWithoutPatterns.length - 1 ? (
              <SeparatorRow
                showPier={usedShowPier}
                showStopColumn={showStopColumn}
              />
            ) : null}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default withTranslation('translations')(StopTimesList);
