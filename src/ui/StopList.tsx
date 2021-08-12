import * as React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { IStopWithName } from './StopsByNameRetriever';

export type IStopRenderFunc = (stop: IStopWithName) => JSX.Element;

export interface IProps {
  readonly stops: ReadonlyArray<IStopWithName>;
  readonly stopRenderer?: IStopRenderFunc;
}

const StopList: React.StatelessComponent<IProps> = ({
  stops,
  stopRenderer,
}: Required<IProps>) => (
  <ul>
    {stops.map((stop: IStopWithName) => (
      <li key={uuid()}>{stopRenderer(stop)}</li>
    ))}
  </ul>
);

StopList.defaultProps = {
  stopRenderer: (stop: IStopWithName) => (
    <Link to={`/stop/${stop.gtfsId}`}>
      {stop.name} - {stop.gtfsId} {stop.code ? `(${stop.code})` : ''}
    </Link>
  ),
};

export default StopList;
