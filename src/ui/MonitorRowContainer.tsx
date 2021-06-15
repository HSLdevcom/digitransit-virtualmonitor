import React, { FC, useState, useEffect } from 'react';
import { getStartTimeWithColon } from '../time';
import MonitorRow from './MonitorRow';
import './MonitorRowContainer.scss';

interface IProps {
  departures: any;
  layout: any;
}

const MonitorRowContainer: FC<IProps> = ({ departures, layout }) => {
  const sortedDepartures = departures.sort(
    (a, b) => a.realtimeDeparture - b.realtimeDeparture,
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
        <div>Linja</div>
        <div>Määränpää</div>
        <div>Lähtöaika</div>
        {leftColumn}
      </div>
      {rightColumnCount > 0 && (
        <>
          <div className="divider" />
          <div className="right grid">
            <div>Linja</div>
            <div>Määränpää</div>
            <div>Lähtöaika</div>
            {rightColumn}
          </div>
        </>
      )}
    </div>
  );
};

export default MonitorRowContainer;
