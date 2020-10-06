import * as React from "react";

import AutoMoment from "src/ui/AutoMoment";
import Logo from 'src/ui/logo/Logo';
import Titlebar from "src/ui/Titlebar";
import TitlebarTime from 'src/ui/TitlebarTime';

export interface IVirtualMonitorProps {
  readonly children?: React.ReactNode,
  readonly title?: React.ReactNode,
};

const VirtualMonitor = (props: IVirtualMonitorProps) => (
  <div style={{ color: 'white', display: 'flex', flexDirection:'column' }}>
    <Titlebar>
      <Logo />
      <div id={"title-text"}>
        {props.title || ''}
      </div>
      <TitlebarTime />
    </Titlebar>
    {props.children}
  </div>
);

export default VirtualMonitor;
