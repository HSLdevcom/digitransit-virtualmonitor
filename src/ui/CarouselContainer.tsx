import React, { FC, useState, useEffect } from 'react';
import { getConfig } from '../util/getConfig';
import Monitor from './Monitor';
import WithDatabaseConnection from './WithDatabaseConnection';

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
}
const CarouselContainer: FC<IProps> = ({ views, noPolling }) => {
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
    <Monitor view={views[current]} config={config} noPolling={noPolling} />
  );
};

export default CarouselContainer;
