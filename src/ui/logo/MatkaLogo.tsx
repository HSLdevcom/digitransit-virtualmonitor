import React from 'react';
import { ReactComponent as Logo } from './matka-logo.svg';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <Logo className="matka" title="logo matka" style={style} />
);
