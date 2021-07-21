/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import MonitorRow, { IDeparture } from './MonitorRow';
import './MonitorRowContainer.scss';
import cx from 'classnames';
import { formatDate, setDate } from '../time';
import { ITranslation } from './TranslationContainer';

interface IProps {
  departuresLeft: Array<IDeparture>;
  departuresRight: Array<IDeparture>;
  translatedStrings: Array<ITranslation>;
  currentLang: string;
  layout: any;
  isPreview: boolean;
  isLandscape: boolean;
  forcedLayout?: string;
}

const MonitorRowContainer: FC<IProps & WithTranslation> = ({
  departuresLeft,
  departuresRight,
  translatedStrings,
  currentLang,
  layout,
  isPreview,
  isLandscape,
  forcedLayout,
  t,
}) => {
  const [leftColumnCount, rightColumnCount, isMultiDisplay, differSize] =
    layout;

  const sortedDeparturesLeft = departuresLeft
    .filter(d => d)
    .sort(
      (a, b) =>
        a.realtimeDeparture +
        a.serviceDay -
        (b.realtimeDeparture + b.serviceDay),
    );

  /* [{ alertHeaderText: 'Pyöriä saa kuljettaa Tuusulan busseissa kesällä 15.8. asti. Pyörän voi ottaa mukaan busseihin 641, 642, 643, 665, 961, 963 ja 975N. hsl.fi/pyoratuusula', alertSeverityLevel: 'INFO', alertDescriptionTextTranslations: [
    {language: 'fi', text: 'Suomeksi'},{language: 'sv', text: 'På svenska'},{language: 'en', text: 'In english'}]
  }]; */
  const routeAlerts = sortedDeparturesLeft.reduce((arr, alert) => {
    const alerts = alert?.trip?.route?.alerts;
    if (alerts) {
      alerts.forEach(a => {
        let i = 0;
        let found = false;
        while (i < arr.length) {
          if (arr[i]?.alertHeaderText === a.alertHeaderText) {
            found = true;
            break;
          }
          i++;
        }
        if (!found) {
          arr.push(a);
        }
      });
    }
    return arr;
  }, []);

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

  const leftColumn = [];
  const rightColumn = [];

  const currentDay = setDate(0);
  const nextDay = setDate(1);

  const currentDayDepartureIndexLeft = -1;
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

  if (routeAlerts.length > 0) {
    sortedDeparturesLeft.splice(leftColumnCount - 1, 0, null);
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
      sortedDeparturesRight.length === 0 ? 0 : 1;
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
  } else if (
    currentDayDeparturesLeft.length > 0 &&
    currentDayDeparturesRight.length === 0
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
    let tightenPosition = '';
    if (isTighten && i < differSize[0]) {
      tightenPosition = !forcedLayout
        ? 'tighten-begin'
        : 'tighten-begin-forced';
    } else if (isTighten && i >= differSize[0]) {
      tightenPosition = !forcedLayout ? 'tighten-end' : 'tighten-end-forced';
    }
    let showAlerts = false;
    if (routeAlerts.length > 0) {
      if (
        (leftColumnCount !== 12 && i === leftColumnCount - 1) ||
        (leftColumnCount === 12 && i === leftColumnCount - 2) ||
        (leftColumnCount === 16 && i === leftColumnCount - 3) ||
        (leftColumnCount === 24 && i === leftColumnCount - 4)
      ) {
        showAlerts = true;
      }
      if (
        withTwoColumns &&
        leftColumnCount === 8 &&
        i === leftColumnCount - 2
      ) {
        showAlerts = true;
      }
      if (isTighten && leftColumnCount === 18 && i === leftColumnCount - 2) {
        showAlerts = true;
      }
    }

    let alertRowSpan = 1;
    if (leftColumnCount === 12 && i === leftColumnCount - 2) {
      alertRowSpan = 2;
    } else if (
      isTighten &&
      leftColumnCount === 18 &&
      i === leftColumnCount - 2
    ) {
      alertRowSpan = 2;
    } else if (leftColumnCount === 16 && i === leftColumnCount - 3) {
      alertRowSpan = 3;
    } else if (
      withTwoColumns &&
      leftColumnCount === 8 &&
      i === leftColumnCount - 2
    ) {
      alertRowSpan = 3;
    } else if (leftColumnCount === 24 && i === leftColumnCount - 4) {
      alertRowSpan = 4;
    }

    leftColumn.push(
      <MonitorRow
        departure={
          i !== nextDayDepartureIndexLeft || !showAlerts
            ? sortedDeparturesLeft[i]
            : null
        }
        translations={translatedStrings}
        size={getCorrectSize(leftColumnCount, i + 1, differSize)}
        withSeparator
        isFirst={i === 0 || i - 1 === nextDayDepartureIndexLeft}
        isLandscape={isLandscape}
        isPreview={isPreview}
        isOneLiner={isOneLiner && !withTwoColumns}
        withTwoColumns={withTwoColumns}
        currentLang={currentLang}
        alerts={showAlerts ? routeAlerts : undefined}
        alertRows={alertRowSpan}
        dayForDivider={
          i === nextDayDepartureIndexLeft ? formatDate(nextDay) : undefined
        }
        tightenPosition={tightenPosition}
      />,
    );
    if (routeAlerts.length > 0) {
      if (leftColumnCount === 12 && i === leftColumnCount - 2) {
        i += 1;
      } else if (
        isTighten &&
        leftColumnCount === 18 &&
        i === leftColumnCount - 2
      ) {
        i += 1;
      } else if (leftColumnCount === 16 && i === leftColumnCount - 3) {
        i += 2;
      } else if (
        withTwoColumns &&
        leftColumnCount === 8 &&
        i === leftColumnCount - 2
      ) {
        i += 2;
      } else if (leftColumnCount === 24 && i === leftColumnCount - 4) {
        i += 3;
      }
    }
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
            currentLang={currentLang}
            translations={translatedStrings}
            withSeparator
            isFirst={
              i === leftColumnCount || i - 1 === nextDayDepartureIndexLeft
            }
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
            currentLang={currentLang}
            translations={translatedStrings}
            withSeparator
            isFirst={i === 0 || i - 1 === nextDayDepartureIndexRight}
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

  const leftColumnStyle = { '--rows': leftColumnCount } as React.CSSProperties;
  const rightColumnStyle = {
    '--rows': rightColumnCount,
  } as React.CSSProperties;

  const tightenBeginStyle = {
    '--rows': differSize ? differSize[0] : leftColumnCount,
  } as React.CSSProperties;
  const tightenEndingStyle = {
    '--rows': differSize ? differSize[1] : leftColumnCount,
  } as React.CSSProperties;
  return (
    <div
      className={cx(
        'monitor-container',
        isPreview ? 'preview' : '',
        !isLandscape ? 'portrait' : '',
        forcedLayout && forcedLayout === 'landscape' ? 'forced-landscape' : '',
        forcedLayout && forcedLayout === 'portrait' ? 'forced-portrait' : '',
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
            forcedLayout && forcedLayout === 'landscape'
              ? 'forced-landscape'
              : '',
            forcedLayout && forcedLayout === 'portrait'
              ? 'forced-portrait'
              : '',
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
            {t('lineId', { lng: currentLang })}
          </div>
          <div
            className={cx(
              'grid-header',
              'destination',
              isPreview ? 'preview' : '',
              !isLandscape ? 'portrait' : '',
            )}
          >
            {t('destination', { lng: currentLang })}
          </div>
          <div
            className={cx(
              'grid-header',
              'time',
              isPreview ? 'preview' : '',
              !isLandscape ? 'portrait' : '',
            )}
          >
            {t('departureTime', { lng: currentLang })}
          </div>
        </div>
        {!isTighten && (
          <div
            style={leftColumnStyle}
            className={cx(
              'grid-rows',
              isPreview ? 'preview' : '',
              !isLandscape ? 'portrait' : '',
              `rows${leftColumnCount}`,
              withTwoColumns ? 'two-cols' : '',
              forcedLayout && forcedLayout === 'landscape'
                ? 'forced-landscape'
                : '',
              forcedLayout && forcedLayout === 'portrait'
                ? 'forced-portrait'
                : '',
            )}
          >
            {leftColumn}
          </div>
        )}
        {isTighten && (
          <>
            <div
              style={tightenBeginStyle}
              className={cx(
                'grid-rows',
                !forcedLayout ? 'tighten-begin' : 'tighten-begin-forced',
                isPreview ? 'preview' : '',
                `rows${differSize[0]}`,
              )}
            >
              {leftColumn.slice(0, differSize[0])}
            </div>
            <div
              style={tightenEndingStyle}
              className={cx(
                'grid-rows',
                !forcedLayout ? 'tighten-end' : 'tighten-end-forced',
                isPreview ? 'preview' : '',
                `rows${differSize[1]}`,
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
                forcedLayout && forcedLayout === 'landscape'
                  ? 'forced-landscape'
                  : '',
                forcedLayout && forcedLayout === 'portrait'
                  ? 'forced-portrait'
                  : '',
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
              style={rightColumnStyle}
              className={cx(
                'grid-rows',
                isPreview ? 'preview' : '',
                !isLandscape ? 'portrait' : '',
                `rows${rightColumnCount}`,
                withTwoColumns ? 'two-cols' : '',
                forcedLayout && forcedLayout === 'landscape'
                  ? 'forced-landscape'
                  : '',
                forcedLayout && forcedLayout === 'portrait'
                  ? 'forced-portrait'
                  : '',
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
