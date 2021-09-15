import React, { FC } from 'react';
import AutoMoment from './AutoMoment';
import { EpochMilliseconds, Milliseconds } from '../time';
import cx from 'classnames';

interface IProps {
  currentTime?: EpochMilliseconds;
  isPreview?: boolean;
  isLandscape?: boolean;
}

const TitlebarTime: FC<IProps> = ({
  currentTime,
  isPreview = false,
  isLandscape = false,
}) => {
  return (
    <div
      className={cx(
        'title-time-container',
        isPreview ? 'preview' : '',
        isLandscape ? '' : 'portrait',
      )}
    >
      <div className={cx('title-time', isPreview ? 'preview' : '')}>
        <AutoMoment currentTime={currentTime} />
      </div>
    </div>
  );
};

export default TitlebarTime;
