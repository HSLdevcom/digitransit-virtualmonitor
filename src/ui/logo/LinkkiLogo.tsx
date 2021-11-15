import * as React from 'react';
import Logo from './linkki-logo.svg';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <div style={{ textAlign: 'left' }}>
    <img title="logo linkki" id={'logo'} src={Logo} style={style} />
  </div>
);
