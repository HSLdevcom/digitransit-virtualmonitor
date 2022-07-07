import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../App';
import Logo from './logo/Logo';
import BurgerMenu from './BurgerMenu';
import Icon from './Icon';

const Banner = () => {
  const user = useContext(UserContext);
  const [t] = useTranslation();
  const [isOpen, changeOpen] = useState(false);
  const setOpen = () => {
    changeOpen(true);
  };

  const setClose = () => {
    changeOpen(false);
  };

  return (
    <div className="main-banner">
      <Logo isLandscape />
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
export default Banner;
