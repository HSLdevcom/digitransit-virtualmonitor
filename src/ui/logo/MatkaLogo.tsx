import * as React from "react";
import * as Logo from "src/ui/logo/matka-logo.svg"

export default ({ style }: {style?: React.CSSProperties} = { style: {} }) => (
  <div style={{ textAlign: 'left' }}>
    <img id={"logo"} src={Logo} style={style} />
  </div>
);
