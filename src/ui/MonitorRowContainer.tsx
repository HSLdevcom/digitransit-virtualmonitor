/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import MonitorRow from './MonitorRow';
import './MonitorRowContainer.scss';
import cx from 'classnames'; 

interface IProps {
  departuresLeft: any;
  departuresRight: any;
  layout: any;
  leftTitle: string;
  rightTitle: string;
}

const MonitorRowContainer: FC<IProps & WithTranslation> = ({
  departuresLeft,
  departuresRight,
  layout,
  leftTitle,
  rightTitle,
  t,
}) => {
  const sortedDeparturesLeft = departuresLeft.sort(
    (a, b) =>
      a.realtimeDeparture + a.serviceDay - (b.realtimeDeparture + b.serviceDay),
  );

  const sortedDeparturesRight =
    departuresRight && departuresRight.length > 0
      ? departuresRight.sort(
          (a, b) =>
            a.realtimeDeparture +
            a.serviceDay -
            (b.realtimeDeparture + b.serviceDay),
        )
      : [];

  const [leftColumnCount, rightColumnCount, isMultiDisplay] = layout;

  const leftColumn = [];
  const rightColumn = [];

  for (let i = 0; i < leftColumnCount; i++) {
    leftColumn.push(
      <MonitorRow
        departure={sortedDeparturesLeft[i]}
        size={leftColumnCount}
        withSeparator
        isFirst={i === 0}
      />,
    );
  }

  if (!isMultiDisplay) {
    for (let i = leftColumnCount; i < leftColumnCount + rightColumnCount; i++) {
      rightColumn.push(
        <MonitorRow
          departure={sortedDeparturesLeft[i]}
          size={rightColumnCount}
          withSeparator
          isFirst={i === leftColumnCount}
        />,
      );
    }
  } else {
    for (let i = 0; i < rightColumnCount; i++) {
      rightColumn.push(
        <MonitorRow
          departure={sortedDeparturesRight[i]}
          size={rightColumnCount}
          withSeparator
          isFirst={i === 0}
        />,
      );
    }
  }

  return (
    <div className="monitor-container">
      <div className={cx('grid', isMultiDisplay ? 'multi-display' : '')}>
        {isMultiDisplay && <div className="title">{leftTitle}</div>}
        <div className={cx('header', 'line')}>{t('lineId')}</div>
        <div className={cx('header', 'destination')}>{t('destination')}</div>
        <div className={cx('header', 'time')}>{t('departureTime')}</div>
        {leftColumn}
      </div>
      {rightColumnCount > 0 && (
        <>
          <div className="divider" />
          <div className={cx('grid', isMultiDisplay ? 'multi-display' : '')}>
            {isMultiDisplay && <div className="title">{rightTitle}</div>}
            <div className={cx('header', 'line')}>{t('lineId')}</div>
            <div className={cx('header', 'destination')}>{t('destination')}</div>
            <div className={cx('header', 'time')}>{t('departureTime')}</div>
            {rightColumn}
          </div>
        </>
      )}
    </div>
  );
};

export default withTranslation('translations')(MonitorRowContainer);
