import * as React from 'react';

import AutoMoment from './AutoMoment';
import Logo from './logo/Logo';
import Titlebar from './Titlebar';
import TitlebarTime from './TitlebarTime';

export interface IVirtualMonitorProps {
  readonly children?: React.ReactNode;
  readonly title?: React.ReactNode;
}

const VirtualMonitor = (props: IVirtualMonitorProps) => (
  <div style={{ color: 'white', display: 'flex', flexDirection: 'column' }}>
    <Titlebar>
      <Logo />
      <div id={'title-text'}>{props.title || ''}</div>
      <TitlebarTime />
    </Titlebar>
    {props.children}
  </div>
);

export default VirtualMonitor;
