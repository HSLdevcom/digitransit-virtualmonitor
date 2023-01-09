import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigContext, UserContext } from '../contexts';
import Logo from './logo/Logo';
import BurgerMenu from './BurgerMenu';
import UserMenu from './UserMenu';
import Icon from './Icon';
import { getLoginUri } from '../util/getLoginUri';

const Banner = () => {
  const config = useContext(ConfigContext);
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

  const { given_name, family_name } = user;
  const initials =
    given_name && family_name
      ? given_name.charAt(0) + family_name.charAt(0)
      : '';

  return (
    <div className="main-banner">
      <Logo isLandscape />
      {config.login.inUse && (
        <>
          <div className="menu-container">
            {user.sub ? (
              <button
                className="menu-button"
                role="button"
                aria-label={t('userMenuOpen')}
                onClick={setUserOpen}
              >
                <div className="usermenu-container">
                  <div>
                    <Icon
                      img="user-icon"
                      width={30}
                      height={30}
                      color={'white'}
                    />
                  </div>
                  <div className="usermenu-text">{initials}</div>
                </div>
              </button>
            ) : (
              <div className="usermenu-container">
                <a href={getLoginUri(config.name)} aria-label={t('login')}>
                  <div>
                    <Icon
                      img="user-icon"
                      width={30}
                      height={30}
                      color={'white'}
                    />
                  </div>
                </a>
              </div>
            )}
          </div>
          <UserMenu
            isOpen={userMenuIsOpen}
            onClose={setUserClose}
            createStatic={user && user.loggedIn}
          />
        </>
      )}
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
