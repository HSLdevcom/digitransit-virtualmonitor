import * as React from "react";

export interface ITitlebarProps {
  readonly children: React.ReactNode;
};

export default (props: ITitlebarProps) => (
  <div id={'title-bar'} style={{ display: 'flex'}}>
    {props.children}
  </div>
);
