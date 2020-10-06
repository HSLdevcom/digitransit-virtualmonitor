import * as React from "react";

import NysseLogo from "src/ui/logo/NysseLogo";
import HslLogo from "src/ui/logo/HslLogo";
import MatkaLogo from "src/ui/logo/MatkaLogo";
import LinkkiLogo from "src/ui/logo/LinkkiLogo";

interface ICommonProps {
  readonly monitorConfig?: any,
}

class Logo extends React.Component<ICommonProps> {
  public render() {
   const monitorConfig = (this.props as ICommonProps).monitorConfig;

    if (monitorConfig) {
      const feedId = monitorConfig.feedId;

      switch (feedId) {
        case "tampere":
          return <NysseLogo style={{ height: "7em", paddingRight: '1em' }} />;
        case "hsl":
          return <HslLogo style={{ height: "6em", paddingRight: '1em' }} />;
        case "matka":
          return <MatkaLogo style={{ maxHeight: "6em" }} />;
        case "linkki":
          return <LinkkiLogo style={{ maxHeight: "6em", paddingRight: '1em' }} />;
        default:
          return null;
      }
    }

    return null;
  }
};

export default Logo;
