import * as React from 'react';
import cx from 'classnames';

import HslLogo from './HslLogo';
import LinkkiLogo from './LinkkiLogo';
import MatkaLogo from './MatkaLogo';
import NysseLogo from './NysseLogo';

interface ICommonProps {
  readonly monitorConfig?: any;
  readonly isPreview?: boolean;
  readonly isLandscape?: boolean;
  readonly forMonitor?: boolean;
}

class Logo extends React.Component<ICommonProps> {
  public render() {
    const monitorConfig = (this.props as ICommonProps).monitorConfig;
    const isPreview = (this.props as ICommonProps).isPreview
      ? (this.props as ICommonProps).isPreview
      : false;
    const isLandscape = (this.props as ICommonProps).isLandscape
      ? (this.props as ICommonProps).isLandscape
      : false;
    const forMonitor = (this.props as ICommonProps).forMonitor
      ? (this.props as ICommonProps).forMonitor
      : false;

    let logo = undefined;
    let isHsl = false;

    if (monitorConfig) {
      const feedIds = monitorConfig.feedIds;
      const feedId = feedIds[0].toLowerCase();

      switch (feedId) {
        case 'tampere':
          logo = <NysseLogo />;
          break;
        case 'hsl':
          logo = <HslLogo forMonitor={forMonitor} />;
          isHsl = true;
          break;
        case 'matka':
          logo = <MatkaLogo />;
          break;
        case 'linkki':
          logo = <LinkkiLogo />;
          break;
        default:
          break;
      }
    }
    if (logo) {
      return (
        <div
          className={cx(
            'title-logo',
            isPreview ? 'preview' : '',
            isLandscape ? '' : 'portrait',
            isHsl ? 'hsl' : '',
          )}
        >
          {logo}
        </div>
      );
    }
    return null;
  }
}

export default Logo;
