import * as React from "react";

import AutoMoment from "src/ui/AutoMoment";
import HslLogo from "src/ui/HslLogo";
import Titlebar from "src/ui/Titlebar";

export interface IVirtualMonitorProps {
  readonly children?: React.ReactNode,
  readonly title?: React.ReactNode,
};

const VirtualMonitor = (props: IVirtualMonitorProps) => (
  <div style={{ color: 'white', display: 'flex', flexDirection:'column' }}>
    <Titlebar>
      <HslLogo />
      <div id={"title-text"}>
        {props.title || ''}
      </div>
      <div id={"title-time"}>
        <AutoMoment />
      </div>
    </Titlebar>
    {props.children}
  </div>
);

export default VirtualMonitor;
