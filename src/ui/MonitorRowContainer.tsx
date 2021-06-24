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
  isPreview: boolean;
  isLandscape: boolean;
}

const MonitorRowContainer: FC<IProps & WithTranslation> = ({
  departuresLeft,
  departuresRight,
  layout,
  leftTitle,
  rightTitle,
  isPreview,
  isLandscape,
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

  const getCorrectSize = (leftColumnCount, rowNo, sizes) => {
    if (sizes) {
      if (sizes.length === 2) {
        return rowNo <= sizes[0] ? sizes[0] : sizes[1];
      }
      if (sizes.length === 3) {
        if (rowNo <= sizes[0]) {
          return sizes[0] * 2;
        } else if (rowNo <= sizes[0] + sizes[1]) {
          return sizes[1] * 2;
        } else {
          return sizes[2] * 2;
        }
      }
    }
    return leftColumnCount;
  };

  const [leftColumnCount, rightColumnCount, isMultiDisplay, differSize] =
    layout;

  const leftColumn = [];
  const rightColumn = [];

  let isOneLiner = sortedDeparturesLeft.slice(0, leftColumnCount).every(d => d.headsign.includes(' via') && d.headsign.length <= 28);
  console.log('isOneLiner:', isOneLiner);

  for (let i = 0; i < leftColumnCount; i++) {
    leftColumn.push(
      <MonitorRow
        departure={sortedDeparturesLeft[i]}
        size={getCorrectSize(leftColumnCount, i + 1, differSize)}
        withSeparator
        isFirst={i === 0}
        isLandscape={isLandscape}
        isPreview={isPreview}
        isOneLiner={isOneLiner}
      />,
    );
  }

  if (isLandscape) {
    if (!isMultiDisplay) {
      for (let i = leftColumnCount; i < leftColumnCount + rightColumnCount; i++) {
        rightColumn.push(
          <MonitorRow
            departure={sortedDeparturesLeft[i]}
            size={rightColumnCount}
            withSeparator
            isFirst={i === leftColumnCount}
            isLandscape={isLandscape}
            isPreview={isPreview}
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
            isLandscape={isLandscape}
            isPreview={isPreview}
          />,
        );
      }
    }
  }

  return (
    <div className={cx('monitor-container', isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>
      <div className={cx('grid', isMultiDisplay ? 'multi-display' : '', isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>
        {isMultiDisplay && <div className={cx('title', isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>{leftTitle}</div>}
        <div className={cx('header', 'line', isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>{t('lineId')}</div>
        <div className={cx('header', 'destination', isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>{t('destination')}</div>
        <div className={cx('header', 'time', isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>{t('departureTime')}</div>
        {leftColumn}
      </div>
      {isLandscape && rightColumnCount > 0 && (
        <>
          <div className={cx('divider', isPreview ? 'preview' : '')} />
          <div className={cx('grid', isMultiDisplay ? 'multi-display' : '', isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>
            {isMultiDisplay && <div className={cx('title', isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>{rightTitle}</div>}
            <div className={cx('header', 'line', isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>{t('lineId')}</div>
            <div className={cx('header', 'destination', isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>
              {t('destination')}
            </div>
            <div className={cx('header', 'time', isPreview ? 'preview' : '', !isLandscape ? 'portrait' : '')}>{t('departureTime')}</div>
            {rightColumn}
          </div>
        </>
      )}
    </div>
  );
};

export default withTranslation('translations')(MonitorRowContainer);
