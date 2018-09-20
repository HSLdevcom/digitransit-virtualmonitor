import * as React from "react";

import AutoMoment from "src/ui/AutoMoment";
import HslLogo from "src/ui/HslLogo";
import { default as StopIncomingRetriever, StopId } from "src/ui/StopIncomingRetriever";
import StopName from "src/ui/StopName";
import Titlebar from "src/ui/Titlebar";

export interface ITimedRoutesViewProps {
  title?: string,
  stops: StopId[],
  displayedRoutes?: number,
  overrideStopNames: {
    [stopGtfsId: string]: string,
  },
};

const TimedRoutesView = (props: ITimedRoutesViewProps) => (
  <div style={{ color: 'white', display: 'flex', flexDirection:'column' }}>
    <Titlebar>
      <HslLogo />
      <div id={"title-text"}>
        {props.title
          ? props.title
          : <StopName stopIds={props.stops} />}
      </div>
      <div id={"title-time"}>
        <AutoMoment />
      </div>
    </Titlebar>
    <StopIncomingRetriever
      stopIds={props.stops}
      displayedRoutes={props.displayedRoutes} 
      overrideStopNames={props.overrideStopNames}
    />
  </div>
);

export default TimedRoutesView;
