import React from 'react';
import Logo from './osl-logo.svg';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <div className="oulu">
    <img title="logo oulu" className="oulu" src={Logo} style={style} />
  </div>
);
