import * as React from 'react';

import './Titlebar.scss';

export interface ITitlebarProps {
  readonly children: React.ReactNode;
}

export default (props: ITitlebarProps) => (
  <div className="title-bar">{props.children}</div>
);
