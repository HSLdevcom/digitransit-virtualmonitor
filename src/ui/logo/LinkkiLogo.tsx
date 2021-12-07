import * as React from 'react';
import Logo from './linkki-logo.svg';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <div style={{ textAlign: 'left' }}>
    <img title="logo linkki" className="linkki" src={Logo} style={style} />
  </div>
);
