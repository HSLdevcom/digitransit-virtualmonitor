import * as React from 'react';
import Logo from './matka-logo.svg';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <img title="logo matka.fi" id={'logo'} src={Logo} style={style} />
);
