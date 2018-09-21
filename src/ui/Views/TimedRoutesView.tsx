import * as React from "react";

import AutoMoment from "src/ui/AutoMoment";
import HslLogo from "src/ui/HslLogo";
import { default as StopIncomingRetriever, IStop, StopId } from "src/ui/StopIncomingRetriever";
import StopName from "src/ui/StopName";
import Titlebar from "src/ui/Titlebar";

export interface ITimedRoutesViewProps {
  title?: string,
  stops: ReadonlyArray<StopId | IStop>,
  displayedRoutes?: number,
  overrideStopNames: {
    [stopGtfsId: string]: string,
  },
  pierColumnTitle?: string,
};

const TimedRoutesView = (props: ITimedRoutesViewProps) => (
  <div style={{ color: 'white', display: 'flex', flexDirection:'column' }}>
    <Titlebar>
      <HslLogo />
      <div id={"title-text"}>
        {props.title
          ? props.title
          : null /*<StopName stopIds={props.stops} />*/}
      </div>
      <div id={"title-time"}>
        <AutoMoment />
      </div>
    </Titlebar>
    <StopIncomingRetriever
      displayedRoutes={props.displayedRoutes} 
      overrideStopNames={props.overrideStopNames}
      pierColumnTitle={props.pierColumnTitle}
      stopIds={
        props.stops.map(stop => (typeof stop === 'object')
          ? stop.gtfsId
          : stop)
      }
    />
  </div>
);

export default TimedRoutesView;
