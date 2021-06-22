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
}

const MonitorRow: FC<IProps> = ({
  departure,
  size,
  withSeparator,
  isFirst = false,
}) => {
  let className;
  switch (size) {
    case 4:
      className = 'large';
      break;
    case 8:
      className = 'medium';
      break;
    case 12:
      className = 'small';
      break;
  }
  const destination =
    departure?.headsign && departure?.headsign.endsWith(' via')
      ? departure?.headsign.substring(0, departure?.headsign.indexOf(' via'))
      : departure?.headsign;

  const splitDestination = destination && destination.includes(' via');
  const destinationWithoutVia = splitDestination
    ? destination.substring(0, destination.indexOf(' via'))
    : destination;
  const viaDestination = splitDestination
    ? destination.substring(destination.indexOf(' via') + 1)
    : '';

  console.log('departure:', departure);
  return (
    <>
      {withSeparator && (
        <div className={cx('separator', isFirst ? 'first' : '')}></div>
      )}
      <div className={cx('row', 'line', className)}>
        {departure?.trip?.route.shortName}
      </div>
      <div className={cx('row', 'destination-two-rows', className)}>
        {destinationWithoutVia}
        <span className="via">{viaDestination}&nbsp;</span>
      </div>
      <div className={cx('row', 'time', className)}>
        {getStartTimeWithColon(departure?.realtimeDeparture)}
      </div>
    </>
  );
};

export default MonitorRow;
