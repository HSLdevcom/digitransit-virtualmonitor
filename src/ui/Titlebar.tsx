import * as React from "react";

import './Titlebar.css';

export interface ITitlebarProps {
  readonly children: React.ReactNode;
};

export default (props: ITitlebarProps) => (
  <div id={'title-bar'}>
    {props.children}
  </div>
);
