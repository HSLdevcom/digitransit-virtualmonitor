import React, { FC } from 'react';
import { getDepartureTime } from '../time';
import cx from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';

interface IRoute {
  shortName: string;
}

interface IStop {
  gtfsId: string;
}
interface ITrip {
  route: IRoute;
  stops: Array<IStop>;
}
export interface IDeparture {
  trip: ITrip;
  headsign: string;
  realtimeDeparture: number;
  realtime: boolean;
  pickupType: string;
  stop: IStop;
}
interface IProps {
  departure: IDeparture;
  size: number;
  withSeparator: boolean;
  isFirst?: boolean;
  isLandscape?: boolean;
  isPreview?: boolean;
  isOneLiner?: boolean;
  withTwoColumns?: boolean;
  isTighten?: boolean;
  dayForDivider?: string;
}

const MonitorRow: FC<IProps & WithTranslation> = ({
  departure,
  size,
  withSeparator,
  isFirst = false,
  isLandscape = true,
  isPreview = false,
  isOneLiner = true,
  withTwoColumns = false,
  isTighten = false,
  dayForDivider,
  t,
}) => {
  const destination =
    departure?.headsign && departure?.headsign.endsWith(' via')
      ? departure?.headsign.substring(0, departure?.headsign.indexOf(' via'))
      : departure?.headsign;

  //const splitDestination = destination && destination.includes(' via') && (isOneLiner && isLandscape && size === 8 || !isOneLiner);
  const splitDestination =
    destination &&
    destination.includes(' via') &&
    (!isOneLiner || isTighten || (!isLandscape && size === 8));
  let destinationWithoutVia = splitDestination
    ? destination.substring(0, destination.indexOf(' via'))
    : destination;
  let viaDestination = splitDestination
    ? destination.substring(destination.indexOf(' via') + 1)
    : '';

  const rowCount = `rows${size}`;

  if (departure?.pickupType === 'NONE') {
    const lastStop = departure?.trip?.stops.slice(-1).pop().gtfsId;
    if (departure.stop.gtfsId === lastStop) {
      destinationWithoutVia = t('endStopArrive');
      viaDestination = t('endStopTerminus');
      if (isLandscape) {
        destinationWithoutVia = destinationWithoutVia
          .concat('/')
          .concat(viaDestination);
        viaDestination = '';
      }
    }
  }

  if (isLandscape && size === 12 && withTwoColumns) {
    viaDestination = '';
  }

  if (!isLandscape) {
    viaDestination = '';
  }

  if (departure === null && dayForDivider) {
    return (
      <div
        className={cx('grid-row', rowCount, withTwoColumns ? 'two-cols' : '')}
      >
        <div
          className={cx(
            'grid-cols-day-divider',
            rowCount,
            withTwoColumns ? 'two-cols' : '',
          )}
        >
          {withSeparator && (
            <div
              className={cx(
                'separator',
                isFirst ? 'first' : '',
                isPreview ? 'preview' : '',
                rowCount,
              )}
            ></div>
          )}
          <div
            className={cx(
              'day-row',
              isPreview ? 'preview' : '',
              rowCount,
              !isLandscape ? 'portrait' : '',
              withTwoColumns ? 'two-cols' : '',
            )}
          >
            <span>{dayForDivider}</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={cx(
        'grid-row',
        rowCount,
        !isLandscape ? 'portrait' : '',
        withTwoColumns ? 'two-cols' : '',
        isTighten ? 'tighten' : '',
      )}
    >
      <div
        className={cx(
          'grid-cols',
          rowCount,
          withTwoColumns ? 'two-cols' : '',
          !isLandscape ? 'portrait' : '',
          isTighten ? 'tighten' : '',
        )}
      >
        {withSeparator && (
          <div
            className={cx(
              'separator',
              isFirst ? 'first' : '',
              isPreview ? 'preview' : '',
              rowCount,
              !isLandscape ? 'portrait' : '',
              isTighten ? 'tighten' : '',
            )}
          ></div>
        )}
        <div
          className={cx(
            'grid-col',
            'line',
            isPreview ? 'preview' : '',
            rowCount,
            withTwoColumns ? 'two-cols' : '',
            !isLandscape ? 'portrait' : '',
            isTighten ? 'tighten' : '',
          )}
        >
          {departure?.trip?.route.shortName}
        </div>
        {isPreview && !isOneLiner && viaDestination.length === 0 && (
          <div
            className={cx(
              'grid-col',
              'destination-one-row',
              'no-via',
              isPreview ? 'preview' : '',
              !isLandscape ? 'portrait' : '',
              rowCount,
              withTwoColumns ? 'two-cols' : '',
              isTighten ? 'tighten' : '',
            )}
          >
            {destinationWithoutVia}
          </div>
        )}
        {isPreview && !isOneLiner && viaDestination.length > 0 && (
          <div
            className={cx(
              'grid-col',
              'destination-two-rows',
              isPreview ? 'preview' : '',
              !isLandscape ? 'portrait' : '',
              rowCount,
              withTwoColumns ? 'two-cols' : '',
              isTighten ? 'tighten' : '',
            )}
          >
            {destinationWithoutVia}
            <span
              className={cx('via', rowCount, withTwoColumns ? 'two-cols' : '')}
            >
              {viaDestination}&nbsp;
            </span>
          </div>
        )}
        {isPreview && isOneLiner && !splitDestination && (
          <div
            className={cx(
              'grid-col',
              'destination',
              isPreview ? 'preview' : '',
              !isLandscape ? 'portrait' : '',
              rowCount,
              withTwoColumns ? 'two-cols' : '',
              isTighten ? 'tighten' : '',
            )}
          >
            {destination ? destination : destinationWithoutVia}
          </div>
        )}
        {isPreview && isOneLiner && splitDestination && (
          <div
            className={cx(
              'grid-col',
              'destination-one-row',
              isPreview ? 'preview' : '',
              !isLandscape ? 'portrait' : '',
              rowCount,
              isTighten ? 'tighten' : '',
            )}
          >
            {destinationWithoutVia}&nbsp;
            <span>{viaDestination}</span>
          </div>
        )}
        <div
          className={cx(
            'grid-col',
            'time',
            isPreview ? 'preview' : '',
            !isLandscape ? 'portrait' : '',
            rowCount,
            withTwoColumns ? 'two-cols' : '',
            isTighten ? 'tighten' : '',
          )}
        >
          {getDepartureTime(departure?.realtimeDeparture, departure?.realtime)}
        </div>
      </div>
    </div>
  );
};

export default withTranslation('translations')(MonitorRow);
