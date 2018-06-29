import * as React from "react";
import { Link } from "react-router-dom";

import { IStop } from "src/ui/StopsByNameRetriever";

export type IStopRenderFunc = (stop: IStop) => JSX.Element;

export interface IProps {
  stops: IStop[],
  stopRenderer?: IStopRenderFunc,
};

const StopList: React.StatelessComponent<IProps> =
  ({ stops, stopRenderer }: Required<IProps>) => (
  <ul>
    {stops.map((stop: IStop) => (
      <li key={stop.gtfsId}>
        {stopRenderer(stop)}
      </li>
    ))}
  </ul>
);

StopList.defaultProps = {
  stopRenderer: (stop: IStop) => (
    <Link
      to={`/stop/${stop.gtfsId}`}
    >
    {stop.name} - {stop.gtfsId}
    </Link>
  ),
};

export default StopList;
