import React from 'react';
import { ReactComponent as Logo } from './lifti-logo.svg';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <div className="vaasa">
    <Logo title="logo vaasa" style={style} />
  </div>
);
