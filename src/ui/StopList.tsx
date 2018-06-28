import * as React from "react";
import { Link } from "react-router-dom";

import { IStop } from "src/ui/StopsByNameRetriever";

export interface IProps {
  stops: IStop[],
};

const StopList = ({ stops }: IProps) => (
  <ul>
    {stops.map((stop: IStop) => (
      <li key={stop.gtfsId}>
        <Link
          to={`/stop/${stop.gtfsId}`}
        >
        {stop.name} - {stop.gtfsId}
        </Link>
      </li>
    ))}
  </ul>
)

export default StopList;
