import React, { FC, useState, useEffect } from 'react';
import { getStartTimeWithColon } from '../time';
import './MonitorRow.scss';
import cx from 'classnames';

interface IProps {
  departure: any;
  size: number;
  withSeparator: boolean;
}

const MonitorRow: FC<IProps> = ({ departure, size, withSeparator }) => {
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
  return (
    <>
    <div className="separator"></div>
      <div className={cx('short-name', className)}>{departure?.trip.route.shortName}</div>
      <div className={cx('headsign', className)}>{departure?.headsign}</div>
      <div className={cx('departure-time', className)}>{getStartTimeWithColon(departure?.realtimeDeparture)}</div>
      
    </>
  );
};

export default MonitorRow;
