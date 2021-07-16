import React, { FC } from 'react';
import AutoMoment from './AutoMoment';
import { EpochMilliseconds, Milliseconds } from '../time';
import cx from 'classnames';

interface IProps {
  currentTime?: EpochMilliseconds;
  updateInterval?: Milliseconds;
  isPreview?: boolean;
  isLandscape?: boolean;
  forcedLayout?: string;
}

const TitlebarTime: FC<IProps> = ({
  currentTime,
  updateInterval,
  isPreview = false,
  isLandscape = false,
  forcedLayout = undefined,
}) => {
  if (!forcedLayout) {
    return (
      <div
        className={cx(
          'title-time-container',
          isPreview ? 'preview' : '',
          isLandscape ? '' : 'portrait',
        )}
      >
        <div className="title-time">
          <AutoMoment
            currentTime={currentTime}
            updateInterval={updateInterval}
          />
        </div>
      </div>
    );
  }
  return (
    <div
      className={
        forcedLayout === 'landscape'
          ? 'title-time-container-forced-landscape'
          : 'title-time-container-forced-portrait'
      }
    >
      <div className="title-time">
        <AutoMoment currentTime={currentTime} updateInterval={updateInterval} />
      </div>
    </div>
  );
};

export default TitlebarTime;
