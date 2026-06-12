import React from 'react';
import { ReactComponent as Logo } from './osl-logo.svg';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <div className="oulu">
    <Logo title="logo oulu" className="oulu" style={style} />
  </div>
);
