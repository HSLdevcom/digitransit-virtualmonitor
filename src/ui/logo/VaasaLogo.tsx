import React from 'react';
import Logo from './lifti-logo.svg';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <div className="vaasa">
    <img title="logo vaasa" src={Logo} style={style} />
  </div>
);
