import * as React from 'react';
import Logo from './matka-logo.svg';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <img className="matka" title="logo matka" src={Logo} style={style} />
);
