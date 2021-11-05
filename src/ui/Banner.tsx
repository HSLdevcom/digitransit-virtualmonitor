import React, { useEffect } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IMonitorConfig } from '../App';
import Logo from './logo/Logo';
import BurgerMenu from './BurgerMenu';

interface Props {
  config?: IMonitorConfig;
  user?: any; // todo: refactor when we have proper user
}
const Banner: React.FC<Props & WithTranslation> = ({ config, user, t }) => {
  useEffect(() => {
    const elements = {
      '.bm-menu-wrap': [{ name: 'aria-hidden', value: 'true' }],
      '.bm-burger-button': [
        { name: 'aria-hidden', value: 'false' },
        { name: 'aria-label', value: t('menuOpen') },
        { name: 'role', value: 'button' },
      ],
    };

    Object.keys(elements).forEach(className => {
      const items = document.querySelectorAll(className);
      if (items) {
        items.forEach(item => {
          elements[className].forEach(attr => {
            item.setAttribute(attr.name, attr.value);
          });
        });
      }
    });
  }, []);

  return (
    <div className="banner">
      <Logo isLandscape monitorConfig={config} />
      <BurgerMenu createStatic={user && user.loggedIn} />
    </div>
  );
};
export default withTranslation('translations')(Banner);
