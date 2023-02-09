import React from 'react';
import Logo from './OSL_Logo_Valkoinen_RGB.png';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <div className="oulu">
    <img title="logo oulu" src={Logo} style={style} />
  </div>
);
