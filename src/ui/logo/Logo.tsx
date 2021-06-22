import * as React from 'react';

import HslLogo from './HslLogo';
import LinkkiLogo from './LinkkiLogo';
import MatkaLogo from './MatkaLogo';
import NysseLogo from './NysseLogo';

interface ICommonProps {
  readonly monitorConfig?: any;
  readonly isPreview?: boolean;
}

class Logo extends React.Component<ICommonProps> {
  public render() {
    const monitorConfig = (this.props as ICommonProps).monitorConfig;
    const isPreview = (this.props as ICommonProps).isPreview ? (this.props as ICommonProps).isPreview : false;

    if (monitorConfig) {
      const feedIds = monitorConfig.feedIds;
      const feedId = feedIds[0].toLowerCase();

      switch (feedId) {
        case 'tampere':
          return (
            <div id={'title-logo'}>
              <NysseLogo style={{ height: isPreview ? '2.5em' : '5em' }} />
            </div>
          );
        case 'hsl':
          return (
            <div id={'title-logo'}>
              <HslLogo style={{ height: isPreview ? '2em' : '4em' }} />
            </div>
          );
        case 'matka':
          return (
            <div id={'title-logo'}>
              <MatkaLogo style={{ maxHeight: isPreview ? '2em' : '4em' }} />
            </div>
          );
        case 'linkki':
          return (
            <div id={'title-logo'}>
              <LinkkiLogo style={{ maxHeight: isPreview ? '2em' : '4em' }} />
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
