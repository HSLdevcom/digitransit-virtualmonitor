/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import MonitorRow from './MonitorRow';
import './MonitorRowContainer.scss';
import cx from 'classnames';
import { formatDate, setDate } from '../time';

interface IProps {
  departuresLeft: any;
  departuresRight: any;
  layout: any;
  // leftTitle: string;
  // rightTitle: string;
  isPreview: boolean;
  isLandscape: boolean;
}

const MonitorRowContainer: FC<IProps & WithTranslation> = ({
  departuresLeft,
  departuresRight,
  layout,
  // leftTitle,
  // rightTitle,
  isPreview,
  isLandscape,
  t,
}) => {
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

  const getCorrectSize = (leftColumnCount, rowNo, sizes) => {
    if (sizes) {
      if (sizes.length === 2) {
        return rowNo <= sizes[0] ? sizes[0] : sizes[1];
      }
    }
    return leftColumnCount;
  };

  const [leftColumnCount, rightColumnCount, isMultiDisplay, differSize] =
    layout;

  const leftColumn = [];
  const rightColumn = [];

  const currentDay = setDate(0);
  const nextDay = setDate(1);

  let currentDayDepartureIndexLeft = -1;
  let nextDayDepartureIndexLeft = sortedDeparturesLeft
    .slice(0, leftColumnCount)
    .findIndex(departure => departure.serviceDay === nextDay.getTime() / 1000);

  const currentDayDeparturesLeft = sortedDeparturesLeft
    .slice(0, leftColumnCount)
    .filter(departure => departure.serviceDay === currentDay.getTime() / 1000);
  const nextDayDeparturesLeft = sortedDeparturesLeft
    .slice(0, leftColumnCount)
    .filter(departure => departure.serviceDay === nextDay.getTime() / 1000);

  let rowCountLeft = currentDayDeparturesLeft.length;
  if (nextDayDeparturesLeft.length !== 0) {
    rowCountLeft += nextDayDeparturesLeft.length + 1;
  }

  if (nextDayDepartureIndexLeft !== -1) {
    if (rowCountLeft < leftColumnCount || rightColumnCount !== 0) {
      nextDayDepartureIndexLeft +=
        currentDayDeparturesLeft.length === 0 ? 0 : 1;
      if (currentDayDeparturesLeft.length > 0) {
        currentDayDepartureIndexLeft = 0;
        sortedDeparturesLeft.splice(0, 0, null);
      }
    }
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
      nextDayDepartureIndexRight +=
        nextDayDepartureIndexRight.length === 0 ? 0 : 1;
      if (currentDayDeparturesRight.length > 0) {
        currentDayDepartureIndexRight = 0;
        sortedDeparturesRight.splice(0, 0, null);
      }
    }
    sortedDeparturesRight.splice(nextDayDepartureIndexRight, 0, null);
  } else if (
    currentDayDeparturesLeft.length === 0 &&
    currentDayDeparturesRight.length > 0
  ) {
    currentDayDepartureIndexRight = 0;
    sortedDeparturesRight.splice(0, 0, null);
  }

  const isOneLiner =
    ((isLandscape && leftColumnCount !== 4) ||
      (!isLandscape && leftColumnCount !== 8)) &&
    (leftColumnCount > 4 ||
      rightColumnCount > 4 ||
      sortedDeparturesLeft
        .slice(0, leftColumnCount)
        .filter(d => d)
        .every(d => d.headsign?.includes(' via') && d.headsign?.length <= 32));

  const isTighten = differSize !== undefined;

  const withTwoColumns = isLandscape && rightColumnCount > 0;

  for (let i = 0; i < leftColumnCount; i++) {
    leftColumn.push(
      <MonitorRow
        departure={
          i !== (nextDayDepartureIndexLeft || currentDayDepartureIndexLeft)
            ? sortedDeparturesLeft[i]
            : null
        }
        size={getCorrectSize(leftColumnCount, i + 1, differSize)}
        withSeparator
        isFirst={i === 0}
        isLandscape={isLandscape}
        isPreview={isPreview}
        isOneLiner={isOneLiner && !withTwoColumns}
        withTwoColumns={withTwoColumns}
        dayForDivider={
          i === nextDayDepartureIndexLeft
            ? formatDate(nextDay)
            : i === currentDayDepartureIndexLeft
            ? formatDate(currentDay)
            : undefined
        }
        isTighten={isTighten}
      />,
    );
  }

  if (isLandscape) {
    if (!isMultiDisplay) {
      for (
        let i = leftColumnCount;
        i < leftColumnCount + rightColumnCount;
        i++
      ) {
        rightColumn.push(
          <MonitorRow
            departure={
              i !== nextDayDepartureIndexLeft ? sortedDeparturesLeft[i] : null
            }
            size={rightColumnCount}
            withSeparator
            isFirst={i === leftColumnCount}
            isLandscape={isLandscape}
            isPreview={isPreview}
            isOneLiner={isOneLiner && !withTwoColumns && rightColumnCount > 4}
            withTwoColumns={withTwoColumns}
            dayForDivider={
              i === nextDayDepartureIndexLeft ? formatDate(nextDay) : undefined
            }
          />,
        );
      }
    } else {
      for (let i = 0; i < rightColumnCount; i++) {
        rightColumn.push(
          <MonitorRow
            departure={
              i !==
              (nextDayDepartureIndexRight || currentDayDepartureIndexRight)
                ? sortedDeparturesRight[i]
                : null
            }
            size={rightColumnCount}
            withSeparator
            isFirst={i === 0}
            isLandscape={isLandscape}
            isPreview={isPreview}
            isOneLiner={isOneLiner && !withTwoColumns && rightColumnCount > 4}
            withTwoColumns={withTwoColumns}
            dayForDivider={
              i === nextDayDepartureIndexRight
                ? formatDate(nextDay)
                : i === currentDayDepartureIndexRight
                ? formatDate(currentDay)
                : undefined
            }
          />,
        );
      }
    }
  }

  return (
    <div
      className={cx(
        'monitor-container',
        isPreview ? 'preview' : '',
        !isLandscape ? 'portrait' : '',
      )}
    >
      <div
        className={cx(
          'grid',
          withTwoColumns ? 'two-cols' : '',
          !isLandscape ? 'portrait' : '',
        )}
      >
        <div
          className={cx(
            'grid-headers',
            withTwoColumns ? 'two-cols' : '',
            isPreview ? 'preview' : '',
            !isLandscape ? 'portrait' : '',
          )}
        >
          <div
            className={cx(
              'grid-header',
              'line',
              isPreview ? 'preview' : '',
              !isLandscape ? 'portrait' : '',
            )}
          >
            {t('lineId')}
          </div>
          <div
            className={cx(
              'grid-header',
              'destination',
              isPreview ? 'preview' : '',
              !isLandscape ? 'portrait' : '',
            )}
          >
            {t('destination')}
          </div>
          <div
            className={cx(
              'grid-header',
              'time',
              isPreview ? 'preview' : '',
              !isLandscape ? 'portrait' : '',
            )}
          >
            {t('departureTime')}
          </div>
        </div>
        {!isTighten && (
          <div
            className={cx(
              'grid-rows',
              isPreview ? 'preview' : '',
              !isLandscape ? 'portrait' : '',
            )}
          >
            {leftColumn}
          </div>
        )}
        {isTighten && (
          <>
            <div
              className={cx(
                'grid-rows',
                'tighten',
                isPreview ? 'preview' : '',
                !isLandscape ? 'portrait' : '',
              )}
            >
              {leftColumn.slice(0, differSize[0])}
            </div>
            <div
              className={cx(
                'grid-rows',
                'tighten',
                isPreview ? 'preview' : '',
                !isLandscape ? 'portrait' : '',
              )}
            >
              {leftColumn.slice(differSize[0])}
            </div>
          </>
        )}
      </div>
      {isLandscape && rightColumnCount > 0 && (
        <>
          <div className={cx('divider', isPreview ? 'preview' : '')} />
          <div
            className={cx(
              'grid',
              withTwoColumns ? 'two-cols' : '',
              !isLandscape ? 'portrait' : '',
            )}
          >
            <div
              className={cx(
                'grid-headers',
                withTwoColumns ? 'two-cols' : '',
                isPreview ? 'preview' : '',
                !isLandscape ? 'portrait' : '',
              )}
            >
              <div
                className={cx(
                  'grid-header',
                  'line',
                  isPreview ? 'preview' : '',
                  !isLandscape ? 'portrait' : '',
                )}
              >
                {t('lineId')}
              </div>
              <div
                className={cx(
                  'grid-header',
                  'destination',
                  isPreview ? 'preview' : '',
                  !isLandscape ? 'portrait' : '',
                )}
              >
                {t('destination')}
              </div>
              <div
                className={cx(
                  'grid-header',
                  'time',
                  isPreview ? 'preview' : '',
                  !isLandscape ? 'portrait' : '',
                )}
              >
                {t('departureTime')}
              </div>
            </div>
            <div
              className={cx(
                'grid-rows',
                isPreview ? 'preview' : '',
                !isLandscape ? 'portrait' : '',
              )}
            >
              {rightColumn}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default withTranslation('translations')(MonitorRowContainer);
