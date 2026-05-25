import * as React from 'react';
import { ReactComponent as Logo } from './linkki-logo.svg';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <div style={{ textAlign: 'left' }}>
    <Logo title="logo linkki" className="linkki" style={style} />
  </div>
);
