/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import MonitorRow from './MonitorRow';
import './MonitorRowContainer.scss';
interface IRouteShortName {
  shortName: string;
}
interface ITrip {
  gtfsId: string;
  route: IRouteShortName;
}
interface IDeparture {
  arrivalDelay: number;
  departureDelay: number;
  headsign: string;
  realtimeArrival: number;
  realtimeDeparture: number;
  scheduledArrival: number;
  scheduledDeparture: number;
  serviceDay: number;
  trip: ITrip;
}

interface IProps {
  departures: Array<IDeparture>;
  layout: Array<any>;
  leftTitle: string;
  rightTitle: string;
}

const MonitorRowContainer: FC<IProps & WithTranslation> = ({
  departures,
  layout,
  leftTitle,
  rightTitle,
  t,
}) => {
  const sortedDepartures = departures.sort(
    (a, b) =>
      a.realtimeDeparture + a.serviceDay - (b.realtimeDeparture + b.serviceDay),
  );
  const [leftColumnCount, rightColumnCount, isMultiDisplay] = layout;

  const leftColumn = [],
    rightColumn = [];

  for (let i = 0; i < leftColumnCount; i++) {
    leftColumn.push(
      <MonitorRow
        departure={sortedDepartures[i]}
        size={leftColumnCount}
        withSeparator
      />,
    );
  }

  for (let i = leftColumnCount; i < leftColumnCount + rightColumnCount; i++) {
    rightColumn.push(
      <MonitorRow
        departure={sortedDepartures[i]}
        size={rightColumnCount}
        withSeparator
      />,
    );
  }

  return (
    <div className="monitor-container">
      <div className="left grid">
        {isMultiDisplay && <div className="title">{leftTitle}</div>}
        <div>{t('lineId')}</div>
        <div>{t('destination')}</div>
        <div className="time">{t('departureTime')}</div>
        {leftColumn}
      </div>
      {rightColumnCount > 0 && (
        <>
          <div className="divider" />
          <div className="right grid">
            {isMultiDisplay && <div className="title">{rightTitle}</div>}
            <div>{t('lineId')}</div>
            <div>{t('destination')}</div>
            <div className="time">{t('departureTime')}</div>
            {rightColumn}
          </div>
        </>
      )}
    </div>
  );
};

export default withTranslation('translations')(MonitorRowContainer);
