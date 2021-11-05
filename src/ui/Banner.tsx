import React, { useEffect } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IMonitorConfig } from '../App';
import Logo from './logo/Logo';
import BurgerMenu from './BurgerMenu';

interface Props {
  config?: IMonitorConfig;
  user?: any; // todo: refactor when we have proper user
}
const Banner: React.FC<Props & WithTranslation> = ({config, user, t}) => {
  useEffect(() => {
    const classNames = ['.bm-menu-wrap', '.bm-item', '.bm-burger-button'];
    const attributesWithValues = [
      [{ name: 'aria-hidden', value: 'true' }],
      [{ name: 'aria-hidden', value: 'true' }, { name: 'tabindex', value: '-1' }],
      [{ name: 'aria-hidden', value: 'false' }, { name: 'aria-label', value: t('menuOpen') }, { name: 'role', value: 'button' }]
    ];
      
    classNames.forEach((className, idx) => {
      const items = document.querySelectorAll(className);
      if (items) {
        items.forEach(item => {
          attributesWithValues[idx].forEach(attr => {
            item.setAttribute(attr.name, attr.value);
          });
        });
      }
    })
  }, []);

  return (
    <div className="banner">
      <Logo isLandscape monitorConfig={config} />
      <BurgerMenu config={config} user={user} />
    </div>
  );
};
export default withTranslation('translations')(Banner);
