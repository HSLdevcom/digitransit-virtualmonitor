import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../contexts';
import Logo from './logo/Logo';
import BurgerMenu from './BurgerMenu';
import UserMenu from './UserMenu';
import Icon from './Icon';

const Banner = () => {
  const user = useContext(UserContext);
  const [t] = useTranslation();
  const [burgerMenuIsOpen, changeBurgerMenuOpen] = useState(false);
  const [userMenuIsOpen, changeUserMenuOpen] = useState(false);
  const setBurgerOpen = () => {
    changeBurgerMenuOpen(true);
  };

  const setBurgerClose = () => {
    changeBurgerMenuOpen(false);
  };

  const setUserOpen = () => {
    changeUserMenuOpen(true);
  };

  const setUserClose = () => {
    changeUserMenuOpen(false);
  };

  return (
    <div className="main-banner">
      <Logo isLandscape />
      {user.sub && (
        <div className="menu-container">
          <button
            className="menu-button"
            role="button"
            aria-label={t('menuOpen')}
            onClick={setUserOpen}
          >
            <Icon img="user-icon" width={40} height={40} color={'white'} />
          </button>
        </div>
      )}
      <UserMenu
        isOpen={userMenuIsOpen}
        onClose={setUserClose}
        createStatic={user && user.loggedIn}
      />
      <div className="menu-container">
        <button
          className="menu-button"
          role="button"
          aria-label={t('menuOpen')}
          onClick={setBurgerOpen}
        >
          <Icon img="menu" width={40} height={40} color={'white'} />
        </button>
      </div>
      <BurgerMenu
        isOpen={burgerMenuIsOpen}
        onClose={setBurgerClose}
        createStatic={user && user.loggedIn}
      />
    </div>
  );
};
export default Banner;
