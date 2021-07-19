import * as React from 'react';
import Logo from './matka-logo.svg';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <div style={{ display: 'flex', textAlign: 'left' }}>
    <img id={'logo'} src={Logo} style={style} />
  </div>
);
