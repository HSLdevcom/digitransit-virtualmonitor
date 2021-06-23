import React, { FC } from 'react';
import AutoMoment from './AutoMoment';
import { EpochMilliseconds, Milliseconds } from '../time';

interface IProps {
  currentTime?: EpochMilliseconds;
  updateInterval?: Milliseconds;
  isPreview?: boolean;
  isLandscape?: boolean;
}

const TitlebarTime: FC<IProps> = ({
  currentTime,
  updateInterval,
  isPreview = false,
  isLandscape = false,
}) => (
  <div className="title-time">
    <AutoMoment currentTime={currentTime} updateInterval={updateInterval} />
  </div>
);

export default TitlebarTime;
