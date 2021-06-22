import React, { FC, useState, useEffect } from 'react';
import { getConfig } from '../util/getConfig';
import Monitor from './Monitor';
import { EpochMilliseconds } from '../time';

interface IStop {
  code: string;
  desc: string;
  gtfsId: string;
  locationType: string;
  name: string;
  hiddenRoutes: Array<any>;
}
interface ISides {
  stops: Array<IStop>;
  title: string;
}
interface IColumn {
  left: ISides;
  right: ISides;
}

interface IView {
  columns: IColumn;
  title: string;
  layout: number;
  duration: number;
}

interface IProps {
  views: Array<IView>;
  noPolling?: boolean;
  time?: EpochMilliseconds;
  isPreview?: boolean;
}

const CarouselContainer: FC<IProps> = ({ views, noPolling, time, isPreview = false }) => {
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
    />
  );
};

export default CarouselContainer;
