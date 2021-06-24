import React, { FC } from 'react';
import { getStartTimeWithColon } from '../time';
import './MonitorRow.scss';
import cx from 'classnames';

interface IRoute {
  shortName: string;
}
interface ITrip {
  route: IRoute;
}
export interface IDeparture {
  trip: ITrip;
  headsign: string;
  realtimeDeparture: number;
}
interface IProps {
  departure: IDeparture;
  size: number;
  withSeparator: boolean;
  isFirst?: boolean;
  isLandscape?: boolean;
  isPreview?: boolean;
  isOneLiner?: boolean;
}

const MonitorRow: FC<IProps> = ({
  departure,
  size,
  withSeparator,
  isFirst = false,
  isLandscape = true,
  isPreview = false,
  isOneLiner = true,
}) => {
  let className;
  switch (size) {
    case 4:
      className = 'x-large';
      break;
    case 6:
      className = 'large';
      break;
    case 8:
      className = 'medium';
      break;
    case 12:
      className = 'small';
      break;
    case 24:
      className = 'x-small';
      break;
  }
  const destination =
    departure?.headsign && departure?.headsign.endsWith(' via')
      ? departure?.headsign.substring(0, departure?.headsign.indexOf(' via'))
      : departure?.headsign;

  const splitDestination = destination && destination.includes(' via') && !isOneLiner;
  const destinationWithoutVia = splitDestination
    ? destination.substring(0, destination.indexOf(' via'))
    : destination;
  const viaDestination = splitDestination
    ? destination.substring(destination.indexOf(' via') + 1)
    : '';

  
  return (
    <>
      {withSeparator && (
        <div className={cx('separator', isFirst ? 'first' : '', isPreview ? 'preview' : '')}></div>
      )}
      <div className={cx('row', 'line', className, isPreview ? 'preview' : '')}>
        {departure?.trip?.route.shortName}
      </div>
      {isPreview && !isOneLiner && (
        <div className={cx('row', 'destination-two-rows', className, isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>
          {destinationWithoutVia}
          <span className="via">{viaDestination}&nbsp;</span>
        </div>
      )}
      {isPreview && isOneLiner && (
        <div className={cx('row', 'destination', className, isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>
          {destination}
        </div>
      )}
      <div className={cx('row', 'time', className, isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>
        {getStartTimeWithColon(departure?.realtimeDeparture)}
      </div>
    </>
  );
};

export default MonitorRow;
