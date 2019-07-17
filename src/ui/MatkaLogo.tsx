import * as React from "react";
import * as Logo from 'src/ui/matka-logo.png'

export default ({ style }: {style?: React.CSSProperties} = { style: {} }) => (
  <img height="80%" src={Logo}  alt="" />
);