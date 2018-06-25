import * as React from "react";

import AutoMoment from "src/ui/AutoMoment";
import HslLogo from "src/ui/HslLogo";
import StopIncomingRetriever from "src/ui/StopIncomingRetriever";
import Titlebar from "src/ui/Titlebar";

export interface IVirtualMonitorProps {
  title?: string
}

export default (props: IVirtualMonitorProps) => (
  <div style={{ color: 'white', display: 'flex', flexDirection:'column' }}>
    <Titlebar>
      <HslLogo />
      <div style={{ alignSelf: 'center' }}>
        {props.title}
      </div>
      <div style={{ alignSelf: 'center' }}>
        <AutoMoment />
      </div>
    </Titlebar>
    <StopIncomingRetriever stopId={'HSL:4700212'} />
  </div>
);
