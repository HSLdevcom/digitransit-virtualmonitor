import * as React from "react";

import AutoMoment from "src/ui/AutoMoment";
import HslLogo from "src/ui/HslLogo";
import { default as StopIncomingRetriever, StopId } from "src/ui/StopIncomingRetriever";
import Titlebar from "src/ui/Titlebar";
import StopName from "./StopName";

export interface IVirtualMonitorProps {
  title?: string,
  stops: StopId[],
  displayedRoutes?: number,
};

const VirtualMonitor = (props: IVirtualMonitorProps) => (
  <div style={{ color: 'white', display: 'flex', flexDirection:'column' }}>
    <Titlebar>
      <HslLogo />
      <div style={{ alignSelf: 'center' }}>
        {props.title
          ? props.title
          : <StopName stopIds={props.stops} />}
      </div>
      <div style={{ alignSelf: 'center' }}>
        <AutoMoment />
      </div>
    </Titlebar>
    <StopIncomingRetriever stopIds={props.stops} displayedRoutes={props.displayedRoutes} />
  </div>
);

export default VirtualMonitor;
