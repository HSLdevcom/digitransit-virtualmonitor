import React, { useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IMonitorConfig } from '../App';
import Logo from './logo/Logo';
import BurgerMenu from './BurgerMenu';
import Icon from './Icon';

interface Props {
  config?: IMonitorConfig;
  user?: any; // todo: refactor when we have proper user
}
const Banner: React.FC<Props & WithTranslation> = ({ config, user, t }) => {
  const [isOpen, changeOpen] = useState(false);

  const setOpen = () => {
    changeOpen(true);
  };

  const setClose = () => {
    changeOpen(false);
  };

  return (
    <div className="main-banner">
      <Logo isLandscape monitorConfig={config} />
      <div className="menu-container">
        <button
          className="menu-button"
          role="button"
          aria-label={t('menuOpen')}
          onClick={setOpen}
        >
          <Icon img="menu" width={40} height={40} color={'white'} />
        </button>
      </div>
      <BurgerMenu
        isOpen={isOpen}
        onClose={setClose}
        createStatic={user && user.loggedIn}
      />
    </div>
  );
};
export default withTranslation('translations')(Banner);
