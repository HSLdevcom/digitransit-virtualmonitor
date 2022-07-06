import React, { FC, useContext } from 'react';
import cx from 'classnames';
import { ConfigContext } from '../../contexts';
import HslLogo from './HslLogo';
import LinkkiLogo from './LinkkiLogo';
import MatkaLogo from './MatkaLogo';
import NysseLogo from './NysseLogo';

interface ICommonProps {
  readonly isPreview?: boolean;
  readonly isLandscape?: boolean;
  readonly forMonitor?: boolean;
}

const Logo: FC<ICommonProps> = (props) => {
  const config = useContext(ConfigContext);
  const { isPreview, isLandscape, forMonitor } = props;

  let logo = undefined;
  let isHsl = false;

  if (config) {
    const feedIds = config.feedIds;
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

export default Logo;
