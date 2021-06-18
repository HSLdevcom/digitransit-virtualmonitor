import React, { FC } from 'react';
import AutoMoment from './AutoMoment';
import { EpochMilliseconds, Milliseconds } from '../time';

interface IProps {
  currentTime?: EpochMilliseconds;
  updateInterval?: Milliseconds;
}

const TitlebarTime: FC<IProps> = ({ currentTime, updateInterval }) => (
  <div id={'title-time'} style={{ fontSize: 'min(4vw, 4em)' }}>
    <AutoMoment currentTime={currentTime} updateInterval={updateInterval} />
  </div>
);

export default TitlebarTime;
