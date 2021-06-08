import * as React from 'react';

import HslLogo from './HslLogo';
import LinkkiLogo from './LinkkiLogo';
import MatkaLogo from './MatkaLogo';
import NysseLogo from './NysseLogo';

interface ICommonProps {
  readonly monitorConfig?: any;
}

class Logo extends React.Component<ICommonProps> {
  public render() {
    const monitorConfig = (this.props as ICommonProps).monitorConfig;

    if (monitorConfig) {
      const feedId = monitorConfig.feedId;

      switch (feedId) {
        case 'tampere':
          return (
            <div id={'title-logo'}>
              <NysseLogo style={{ height: '7em' }} />
            </div>
          );
        case 'hsl':
          return (
            <div id={'title-logo'}>
              <HslLogo style={{ height: '6em' }} />
            </div>
          );
        case 'matka':
          return (
            <div id={'title-logo'}>
              <MatkaLogo style={{ maxHeight: '6em' }} />
            </div>
          );
        case 'linkki':
          return (
            <div id={'title-logo'}>
              <LinkkiLogo style={{ maxHeight: '6em' }} />
            </div>
          );
        default:
          return null;
      }
    }

    return null;
  }
}

export default Logo;
