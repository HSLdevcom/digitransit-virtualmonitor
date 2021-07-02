import React, { FC, useState, useEffect } from 'react';
import { getConfig } from '../util/getConfig';
import { IView } from '../util/Interfaces';
import Monitor from './Monitor';
import { EpochMilliseconds } from '../time';

interface IProps {
  views: Array<IView>;
  noPolling?: boolean;
  time?: EpochMilliseconds;
  isPreview?: boolean;
  isLandscape?: boolean;
}

const CarouselContainer: FC<IProps> = ({
  views,
  noPolling,
  time,
  isPreview = false,
  isLandscape = true,
}) => {
  const len = views.length;
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const next = (current + 1) % len;
    const time = views[current].duration * 1000;
    const id = setTimeout(() => setCurrent(next), time);
    return () => clearTimeout(id);
  }, [current]);
  const config = getConfig();
  return (
    <Monitor
      view={views[current]}
      index={current}
      config={config}
      noPolling={noPolling}
      time={time}
      isPreview={isPreview}
      isLandscape={isLandscape}
    />
  );
};

export default CarouselContainer;
