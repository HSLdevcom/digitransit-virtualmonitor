import * as React from 'react';

import NysseLogo from 'src/ui/logo/NysseLogo';
import HslLogo from 'src/ui/logo/HslLogo';
import MatkaLogo from 'src/ui/logo/MatkaLogo';
import LinkkiLogo from 'src/ui/logo/LinkkiLogo';

interface ICommonProps {
  readonly monitorConfig?: any,
}

class Logo extends React.Component<ICommonProps> {
  public render() {
   const monitorConfig = (this.props as ICommonProps).monitorConfig

    if(monitorConfig) {
      const feedId = monitorConfig.feedId;
      switch (feedId) {
        case 'tampere':
          return <NysseLogo />;
        case 'hsl':
          return <HslLogo />;
        case 'matka':
          return <MatkaLogo />;
        case 'linkki':
          return <LinkkiLogo />;
        default:
          return null;
      }
    }
    return null;
  }
}

export default Logo;
