/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import MonitorRow, { IDeparture } from './MonitorRow';
import cx from 'classnames';
import { formatDate, setDate, formattedDateTimeFromSeconds } from '../time';
import { getLayout } from '../util/getLayout';
import { ITranslation } from './TranslationContainer';
import { v4 as uuid } from 'uuid';
import { IClosedStop } from '../util/Interfaces';
import { useTranslation } from 'react-i18next';

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
  preview: boolean;
}
const hasColumn = value => value === false;

const MonitorRowContainer: FC<IProps> = ({
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
  preview,
}) => {
  const [t] = useTranslation();
  const DATE_FORMAT = 'dd.MM.yyyy HH:mm';
  const { leftColumnCount, rightColumnCount, isMultiDisplay, tighten } =
    getLayout(layout);

  const leftColumn = [];
  const rightColumn = [];

  const currentDay = setDate(0);
  const nextDay = setDate(1);
  const nextDayDepartureIndexLeft = departuresLeft
    .slice(0, leftColumnCount)
    .findIndex(departure => departure.serviceDay === nextDay.getTime() / 1000);

  if (nextDayDepartureIndexLeft !== -1) {
    departuresLeft.splice(nextDayDepartureIndexLeft, 0, null);
  }

  let currentDayDepartureIndexRight = -1;
  let nextDayDepartureIndexRight = departuresRight
    .slice(0, rightColumnCount)
    .findIndex(departure => departure.serviceDay === nextDay.getTime() / 1000);

  const currentDayDeparturesRight = departuresRight
    .slice(0, rightColumnCount)
    .filter(departure => departure.serviceDay === currentDay.getTime() / 1000);
  const nextDayDeparturesRight = departuresRight
    .slice(0, rightColumnCount)
    .filter(departure => departure.serviceDay === nextDay.getTime() / 1000);

  let rowCountRight = currentDayDeparturesRight.length;
  if (nextDayDeparturesRight.length !== 0) {
    rowCountRight += nextDayDeparturesRight.length + 1;
  }

  if (currentDayDepartureIndexRight !== -1) {
    if (rowCountRight < rightColumnCount || rightColumnCount !== 0) {
      nextDayDepartureIndexRight += departuresRight.length === 0 ? 0 : 1;
      if (currentDayDeparturesRight.length > 0) {
        currentDayDepartureIndexRight = 0;
        departuresRight.splice(0, 0, null);
      }
    }
    departuresRight.splice(nextDayDepartureIndexRight, 0, null);
  }

  const isTighten = tighten !== undefined;
  const hasRouteColumn = [];
  leftStops.forEach(s => {
    if (s.settings && s.settings.showRouteColumn !== undefined) {
      hasRouteColumn.push(s.settings.showRouteColumn);
    } else {
      hasRouteColumn.push(true);
    }
  });
  const withoutRouteColumn = hasRouteColumn.every(hasColumn);
  const withTwoColumns = isLandscape && rightColumnCount > 0;
  let leftColumnCountWithAlerts = leftColumnCount;
  if (alertComponent && layout < 12) {
    leftColumnCountWithAlerts -= alertRowSpan;
  }
  for (let i = 0; i < leftColumnCountWithAlerts; i++) {
    const departure =
      i !== nextDayDepartureIndexLeft ? departuresLeft[i] : null;
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
          i === nextDayDepartureIndexLeft
            ? formatDate(nextDay, currentLang)
            : undefined
        }
        showMinutes={showMinutes || 0}
        withoutRouteColumn={withoutRouteColumn}
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
          i !== nextDayDepartureIndexLeft ? departuresLeft[i] : null;
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
              i === nextDayDepartureIndexLeft
                ? formatDate(nextDay, currentLang)
                : undefined
            }
            currentLang={currentLang}
            showMinutes={showMinutes || 0}
            withoutRouteColumn={withoutRouteColumn}
          />,
        );
      }
    } else {
      for (let i = 0; i < rightColumnCount; i++) {
        const departure =
          i !== nextDayDepartureIndexRight ? departuresRight[i] : null;
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
              i === nextDayDepartureIndexRight
                ? formatDate(nextDay, currentLang)
                : undefined
            }
            currentLang={currentLang}
            showMinutes={showMinutes || 0}
            withoutRouteColumn={withoutRouteColumn}
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

    const hasRouteColumn = [];
    stops.forEach(s => {
      if (s.settings && s.settings.showRouteColumn !== undefined) {
        hasRouteColumn.push(s.settings.showRouteColumn);
      } else {
        hasRouteColumn.push(true);
      }
    });

    if (stops.length === 0 && hasRouteColumn.length === 0) {
      hasRouteColumn.push(true);
    }

    const withoutRouteColumn = hasRouteColumn.every(hasColumn);
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
        <div
          className={cx(
            'grid-row',
            { 'with-stop-code': withStopCode },
            { 'without-route-column': withoutRouteColumn },
          )}
        >
          {!withoutRouteColumn && (
            <div className={cx('grid-header', 'line')}>
              {t('lineId', { lng: currentLang })}
            </div>
          )}
          <div className={cx('grid-header', 'destination')}>
            {t('destination', { lng: currentLang })}
          </div>
          {withStopCode && (
            <div className={cx('grid-header', 'platform-code')}>
              {t('platform-or-stop', { lng: currentLang })}
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

  const noKnownDeparturesLeft =
    !departuresLeft.length &&
    !leftStops.every(s => s.settings?.allRoutesHidden);
  const noKnownDeparturesRight =
    !departuresRight.length &&
    !rightStops.every(s => s.settings?.allRoutesHidden);

  return (
    <div
      className={cx('monitor-container', {
        preview: preview,
        portrait: !isLandscape,
        'two-cols': withTwoColumns,
        tightened: isTighten,
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
              'no-departures': isClosedStopOnLeft || noKnownDeparturesLeft,
            },
          )}
        >
          {!isClosedStopOnLeft && !noKnownDeparturesLeft ? (
            <>{isTighten ? leftColumn.slice(tighten[0]) : leftColumn}</>
          ) : (
            <div className="no-departures-text-container">
              <div
                className={cx('no-departures-text', {
                  'closed-stop': isClosedStopOnLeft,
                })}
              >
                {isClosedStopOnLeft
                  ? t('closedStopWithRange', {
                      lng: currentLang,
                      name: closedStopViews[closedStopIndex].name,
                      code: closedStopViews[closedStopIndex].code,
                      startTime: formattedDateTimeFromSeconds(
                        closedStopViews[closedStopIndex].startTime,
                        DATE_FORMAT,
                      ),
                      endTime: formattedDateTimeFromSeconds(
                        closedStopViews[closedStopIndex].endTime,
                        DATE_FORMAT,
                      ),
                    })
                  : t('no-departures', { lng: currentLang })}
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
                  'no-departures':
                    isClosedStopOnRight || noKnownDeparturesRight,
                })}
              >
                {isClosedStopOnRight || noKnownDeparturesRight ? (
                  <>
                    <div className="no-departures-text-container">
                      <div
                        className={cx('no-departures-text', {
                          'closed-stop': isClosedStopOnRight,
                        })}
                      >
                        {isClosedStopOnRight
                          ? t('closedStopWithRange', {
                              lng: currentLang,
                              name: closedStopViews[closedStopIndex].name,
                              code: closedStopViews[closedStopIndex].code,
                              startTime: formattedDateTimeFromSeconds(
                                closedStopViews[closedStopIndex].startTime,
                                DATE_FORMAT,
                              ),
                              endTime: formattedDateTimeFromSeconds(
                                closedStopViews[closedStopIndex].endTime,
                                DATE_FORMAT,
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

export default MonitorRowContainer;
