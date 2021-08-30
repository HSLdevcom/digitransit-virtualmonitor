/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import MonitorRow, { IDeparture } from './MonitorRow';
import cx from 'classnames';
import { formatDate, setDate, setDateWithSeconds } from '../time';
import { getLayout } from '../util/getLayout';
import { ITranslation } from './TranslationContainer';
import { v4 as uuid } from 'uuid';
import { IClosedStop } from '../util/Interfaces';

interface IProps {
  viewId: number;
  departuresLeft: Array<IDeparture>;
  departuresRight: Array<IDeparture>;
  rightStops: Array<any>;
  leftStops: Array<any>;
  translatedStrings: Array<ITranslation>;
  currentLang: string;
  layout: any;
  isLandscape: boolean;
  alertState: number;
  alertComponent: any;
  alertRowSpan: number;
  showMinutes?: number;
  closedStopViews: Array<IClosedStop>;
}

const MonitorRowContainer: FC<IProps & WithTranslation> = ({
  viewId,
  departuresLeft,
  departuresRight,
  rightStops,
  leftStops,
  translatedStrings,
  currentLang,
  layout,
  isLandscape,
  alertState,
  alertComponent,
  alertRowSpan,
  showMinutes,
  closedStopViews,
  t,
}) => {
  const { leftColumnCount, rightColumnCount, isMultiDisplay, tighten } =
    getLayout(layout);

  const sortedDeparturesLeft = departuresLeft
    .filter(d => d)
    .sort(
      (a, b) =>
        a.realtimeDeparture +
        a.serviceDay -
        (b.realtimeDeparture + b.serviceDay),
    );

  const sortedDeparturesRight =
    departuresRight && departuresRight.length > 0
      ? departuresRight
          .filter(d => d)
          .sort(
            (a, b) =>
              a.realtimeDeparture +
              a.serviceDay -
              (b.realtimeDeparture + b.serviceDay),
          )
      : [];

  const leftColumn = [];
  const rightColumn = [];

  const currentDay = setDate(0);
  const nextDay = setDate(1);

  const nextDayDepartureIndexLeft = sortedDeparturesLeft
    .slice(0, leftColumnCount)
    .findIndex(departure => departure.serviceDay === nextDay.getTime() / 1000);

  const currentDayDeparturesLeft = sortedDeparturesLeft
    .slice(0, leftColumnCount)
    .filter(departure => departure.serviceDay === currentDay.getTime() / 1000);
  const nextDayDeparturesLeft = sortedDeparturesLeft
    .slice(0, leftColumnCount)
    .filter(departure => departure.serviceDay === nextDay.getTime() / 1000);

  if (nextDayDepartureIndexLeft !== -1) {
    sortedDeparturesLeft.splice(nextDayDepartureIndexLeft, 0, null);
  }

  let currentDayDepartureIndexRight = -1;
  let nextDayDepartureIndexRight = sortedDeparturesRight
    .slice(0, rightColumnCount)
    .findIndex(departure => departure.serviceDay === nextDay.getTime() / 1000);

  const currentDayDeparturesRight = sortedDeparturesRight
    .slice(0, rightColumnCount)
    .filter(departure => departure.serviceDay === currentDay.getTime() / 1000);
  const nextDayDeparturesRight = sortedDeparturesRight
    .slice(0, rightColumnCount)
    .filter(departure => departure.serviceDay === nextDay.getTime() / 1000);

  let rowCountRight = currentDayDeparturesRight.length;
  if (nextDayDeparturesRight.length !== 0) {
    rowCountRight += nextDayDeparturesRight.length + 1;
  }

  if (currentDayDepartureIndexRight !== -1) {
    if (rowCountRight < rightColumnCount || rightColumnCount !== 0) {
      nextDayDepartureIndexRight += sortedDeparturesRight.length === 0 ? 0 : 1;
      if (currentDayDeparturesRight.length > 0) {
        currentDayDepartureIndexRight = 0;
        sortedDeparturesRight.splice(0, 0, null);
      }
    }
    sortedDeparturesRight.splice(nextDayDepartureIndexRight, 0, null);
  }

  const isTighten = tighten !== undefined;

  const withTwoColumns = isLandscape && rightColumnCount > 0;
  let leftColumnCountWithAlerts = leftColumnCount;
  if (alertComponent && layout < 12) {
    leftColumnCountWithAlerts -= alertRowSpan;
  }
  for (let i = 0; i < leftColumnCountWithAlerts; i++) {
    const departure =
      i !== nextDayDepartureIndexLeft ? sortedDeparturesLeft[i] : null;
    leftColumn.push(
      <MonitorRow
        key={departure ? departure.trip.gtfsId : uuid()}
        departure={departure}
        translations={translatedStrings}
        isFirst={i === 0 || i - 1 === nextDayDepartureIndexLeft}
        showVia={
          layout < 4 ||
          layout === 12 ||
          (layout === 16 && i < 4) ||
          leftColumnCount === 4
        }
        isTwoRow={
          leftColumnCount === 4 || layout === 12 || (layout === 16 && i < 4)
        }
        withTwoColumns={withTwoColumns}
        alertState={alertState}
        stops={leftStops}
        currentLang={currentLang}
        dayForDivider={
          i === nextDayDepartureIndexLeft ? formatDate(nextDay) : undefined
        }
        showMinutes={showMinutes || 0}
      />,
    );
  }

  if (isLandscape) {
    if (!isMultiDisplay) {
      for (
        let i = leftColumnCountWithAlerts;
        i < leftColumnCountWithAlerts + rightColumnCount;
        i++
      ) {
        const departure =
          i !== nextDayDepartureIndexLeft ? sortedDeparturesLeft[i] : null;
        rightColumn.push(
          <MonitorRow
            key={departure ? departure.trip.gtfsId : uuid()}
            departure={departure}
            translations={translatedStrings}
            isFirst={
              i === leftColumnCountWithAlerts ||
              i - 1 === nextDayDepartureIndexLeft
            }
            isTwoRow={rightColumnCount === 4 || layout === 12}
            stops={leftStops}
            showVia={rightColumnCount === 4}
            withTwoColumns={withTwoColumns}
            alertState={alertState}
            dayForDivider={
              i === nextDayDepartureIndexLeft ? formatDate(nextDay) : undefined
            }
            currentLang={currentLang}
            showMinutes={showMinutes || 0}
          />,
        );
      }
    } else {
      for (let i = 0; i < rightColumnCount; i++) {
        const departure =
          i !== nextDayDepartureIndexRight ? sortedDeparturesRight[i] : null;
        rightColumn.push(
          <MonitorRow
            key={departure ? departure.trip.gtfsId : uuid()}
            departure={departure}
            isTwoRow={rightColumnCount === 4 || layout === 12}
            stops={rightStops}
            translations={translatedStrings}
            isFirst={i === 0 || i - 1 === nextDayDepartureIndexRight}
            showVia={rightColumnCount === 4}
            withTwoColumns={withTwoColumns}
            alertState={alertState}
            dayForDivider={
              i === nextDayDepartureIndexRight ? formatDate(nextDay) : undefined
            }
            currentLang={currentLang}
            showMinutes={showMinutes || 0}
          />,
        );
      }
    }
  }

  const headers = (columns, stops) => {
    let withStopCode = false;
    stops.forEach(s => {
      if (s.settings?.showStopNumber) {
        withStopCode = true;
      }
    });

    return (
      <div
        className={cx(
          'grid-headers',
          `rows${isTighten ? tighten[0] : columns}`,
          {
            tightened: isTighten,
            portrait: !isLandscape,
            'two-cols': withTwoColumns,
          },
        )}
      >
        <div className={cx('grid-row', { 'with-stop-code': withStopCode })}>
          <div className={cx('grid-header', 'line')}>
            {t('lineId', { lng: currentLang })}
          </div>
          <div className={cx('grid-header', 'destination')}>
            {t('destination', { lng: currentLang })}
          </div>
          {withStopCode && (
            <div className={cx('grid-header', 'platform-code')}>
              {t('platform/stop', { lng: currentLang })}
            </div>
          )}
          <div className={cx('grid-header', 'time')}>
            {t('departureTime', { lng: currentLang })}
          </div>
        </div>
      </div>
    );
  };

  const closedStopIndex = closedStopViews.findIndex(s => s.viewId === viewId);
  const isClosedStopOnLeft =
    closedStopIndex !== -1 &&
    closedStopViews[closedStopIndex].column === 'left';
  const isClosedStopOnRight =
    closedStopIndex !== -1 &&
    closedStopViews[closedStopIndex].column === 'right';

  return (
    <div
      className={cx('monitor-container', {
        portrait: !isLandscape,
        'two-cols': withTwoColumns,
      })}
    >
      <div
        className={cx('grid', {
          portrait: !isLandscape,
          'two-cols': withTwoColumns,
        })}
      >
        {headers(leftColumnCount, leftStops)}
        {isTighten && departuresLeft.length > 0 && (
          <div
            className={cx('grid-rows portrait tightened', `rows${tighten[0]}`)}
          >
            {leftColumn.slice(0, tighten[0])}
          </div>
        )}
        <div
          className={cx(
            'grid-rows',
            `rows${isTighten ? tighten[1] : leftColumnCount}`,
            {
              portrait: !isLandscape,
              'two-cols': withTwoColumns,
              tightened: isTighten,
              'no-departures': departuresLeft.length === 0,
            },
          )}
        >
          {departuresLeft.length > 0 ? (
            <>{isTighten ? leftColumn.slice(tighten[0]) : leftColumn}</>
          ) : (
            <div className="no-departures-text-container">
              <div className={cx("no-departures-text", {'closed-stop': isClosedStopOnLeft})}>
              {isClosedStopOnLeft
                ? t('closedStopWithRange', {
                    lng: currentLang,
                    name: closedStopViews[closedStopIndex].name,
                    code: closedStopViews[closedStopIndex].code,
                    startTime: setDateWithSeconds(
                      closedStopViews[closedStopIndex].startTime,
                    ),
                    endTime: setDateWithSeconds(
                      closedStopViews[closedStopIndex].endTime,
                    ),
                  })
                : (
                  <>
                {t('no-departures', { lng: currentLang })}</>
              )}
              </div>
            </div>
          )}
          {alertComponent}
        </div>
      </div>
      {isLandscape && rightColumnCount > 0 && (
        <>
          <div className="divider" />
          {true && (
            <div className={cx('grid', { 'two-cols': withTwoColumns })}>
              {headers(
                rightColumnCount,
                isMultiDisplay ? rightStops : leftStops,
              )}
              <div
                className={cx('grid-rows', `rows${rightColumnCount}`, {
                  'two-cols': withTwoColumns,
                  'no-departures': departuresRight.length > 0,
                })}
              >
                {departuresRight.length === 0 && !(sortedDeparturesLeft.length > leftColumnCount) ? (
                  <>
                    <div className="no-departures-text-container">
                      <div className={cx("no-departures-text", {'closed-stop': isClosedStopOnRight})}>
                      {isClosedStopOnRight
                    ? t('closedStopWithRange', {
                        lng: currentLang,
                        name: closedStopViews[closedStopIndex].name,
                        code: closedStopViews[closedStopIndex].code,
                        startTime: setDateWithSeconds(
                          closedStopViews[closedStopIndex].startTime,
                        ),
                        endTime: setDateWithSeconds(
                          closedStopViews[closedStopIndex].endTime,
                        ),
                      })
                    : t('no-departures', { lng: currentLang })}
                      </div>
                    </div>

                    {alertComponent && <div className="alert-padding"></div>}
                  </>
                ) : (
                  <>{rightColumn}</>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default withTranslation('translations')(MonitorRowContainer);
