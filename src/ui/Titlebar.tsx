import * as React from "react";

import 'src/ui/Titlebar.css';

export interface ITitlebarProps {
  readonly children: React.ReactNode;
};

export default (props: ITitlebarProps) => (
  <div id={'title-bar'} style={{ display: 'flex'}}>
    {props.children}
  </div>
);
