import * as React from "react";
import { Link } from "react-router-dom";

import { IStopWithName } from "src/ui/StopsByNameRetriever";

export type IStopRenderFunc = (stop: IStopWithName) => JSX.Element;

export interface IProps {
  readonly stops: ReadonlyArray<IStopWithName>,
  readonly stopRenderer?: IStopRenderFunc,
};

const StopList: React.StatelessComponent<IProps> =
  ({ stops, stopRenderer }: Required<IProps>) => (
  <ul>
    {stops.map((stop: IStopWithName) => (
      <li key={stop.gtfsId}>
        {stopRenderer(stop)}
      </li>
    ))}
  </ul>
);

StopList.defaultProps = {
  stopRenderer: (stop: IStopWithName) => (
    <Link
      to={`/stop/${stop.gtfsId}`}
    >
    {stop.name} - {stop.gtfsId}
    </Link>
  ),
};

export default StopList;
