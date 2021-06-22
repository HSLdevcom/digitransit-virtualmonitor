import React, { FC } from 'react';
import AutoMoment from './AutoMoment';
import { EpochMilliseconds, Milliseconds } from '../time';

interface IProps {
  currentTime?: EpochMilliseconds;
  updateInterval?: Milliseconds;
  isPreview?: boolean;
}

const TitlebarTime: FC<IProps> = ({ currentTime, updateInterval, isPreview = false }) => (
  <div id={'title-time'} style={{ fontSize: isPreview ? 'min(2vw, 2em)' : 'min(4vw, 4em)' }}>
    <AutoMoment currentTime={currentTime} updateInterval={updateInterval} />
  </div>
);

export default TitlebarTime;
