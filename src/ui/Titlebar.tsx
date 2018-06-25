import * as React from "react";

export interface ITitlebarProps {
  children: React.ReactNode[];
};

export default (props: ITitlebarProps) => (
  <div style={{ display: 'flex'}}>
    {props.children}
  </div>
);
