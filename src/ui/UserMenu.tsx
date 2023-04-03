import React, { FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
import Modal from 'react-modal';
import { ConfigContext, UserContext } from '../contexts';
import { logout } from '../util/logoutUtil';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');
interface Props {
  createStatic: boolean;
  onClose: (option) => void;
  isOpen: boolean;
}

const UserMenu: FC<Props> = ({ createStatic, isOpen, onClose }) => {
  const [t, i18n] = useTranslation();
  const config = useContext(ConfigContext);
  const user = useContext(UserContext);
  const [userState, setUser] = useState(user);

  const modalStyle = {
    overlay: {
      backgroundColor: 'none',
    },
  };

  const classNames = {
    base: 'menu-content',
    afterOpen: 'menu-content-open',
    beforeClose: 'menu-content-close',
  };
  const overlayClassNames = {
    base: 'menu-background',
    afterOpen: 'menu-background-open',
    beforeClose: 'menu-background-close',
  };

  return (
    <Modal
      isOpen={isOpen}
      style={modalStyle}
      closeTimeoutMS={500}
      className={classNames}
      overlayClassName={overlayClassNames}
      onRequestClose={() => onClose(null)}
    >
      <div className="container">
        <section id="close">
          <button
            className="close-button"
            role="button"
            aria-label={t('userMenuClose')}
            onClick={onClose}
          >
            <Icon
              img="close"
              color={config.colors.primary}
              height={24}
              width={24}
            />
          </button>
        </section>
        {user.sub && (
          <section id="links" style={{ display: 'flex' }}>
            <a
              href={'/logout'}
              onClick={() => {
                logout(setUser);
              }}
              aria-label={t('logout')}
            >
              <div className="link">{t('logout')}</div>
            </a>
          </section>
        )}
        <></>
      </div>
    </Modal>
  );
};
export default UserMenu;
