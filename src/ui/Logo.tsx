import NysseLogo from "src/ui/NysseLogo";
import HslLogo from "src/ui/HslLogo";
import * as React from 'react';
import { render } from 'react-dom';

interface ICommonProps {
  readonly monitorConfig?: any,
}
class Logo extends React.Component<ICommonProps> {

  public render() {
   const monitorConfig = (this.props as ICommonProps).monitorConfig

    if(monitorConfig) {
      const agency = monitorConfig.agency;
      switch (agency) {
        case "tampere":
          return <NysseLogo />;
        case "hsl":
          return <HslLogo />;
        default:
          return null;
      }
    }
    return null;
  }
}
export default Logo;
