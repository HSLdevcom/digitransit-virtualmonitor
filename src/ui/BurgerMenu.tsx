import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { getColorByName } from '../util/getConfig';
import Modal from 'react-modal';

Modal.setAppElement('#root');
interface Props {
  createStatic: boolean;
  onClose: (option) => void;
  isOpen: boolean;
}

const BurgerMenu: React.FC<Props & WithTranslation> = ({
  createStatic,
  t,
  i18n,
  isOpen,
  onClose,
}) => {
  const changeLanguage = (i18n, lang) => {
    i18n.changeLanguage(lang);
  };

  const languageCodes = ['fi', 'sv', 'en'];

  const languageElements = () => {
    const retValue = [];
    languageCodes.forEach(language => {
      retValue.push(
        <Link
          className="lang-select"
          onClick={() => changeLanguage(i18n, language)}
          to={window.location.pathname}
          aria-label={t('changeLanguage', {
            language: t(
              `languageName${
                language.charAt(0).toUpperCase() + language.slice(1)
              }`,
            ),
          })}
        >
          {language}
        </Link>,
      );
    });
    return retValue;
  };

  const links = [
    { text: t('breadCrumbsFrontPage'), to: '/' },
    {
      text: t('createViewTitle'),
      to: createStatic ? '/createStaticView' : '/createView',
    },
    { text: t('breadCrumbsHelp'), to: '/help' },
  ];

  const linkElements = () => {
    const retValue = [];
    links.forEach(link => {
      retValue.push(
        <Link className="link" to={link.to}>
          {link.text}
        </Link>,
      );
    });
    return retValue;
  };

  const modalStyle = {
    overlay: {
      backgroundColor: 'none',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      style={modalStyle}
      onRequestClose={() => onClose(null)}
    >
      <div className="container">
        <section id="close">
          <button
            className="close-button"
            role="button"
            aria-label={t('menuClose')}
            onClick={onClose}
          >
            <Icon
              img="close"
              color={getColorByName('primary')}
              height={24}
              width={24}
            />
          </button>
        </section>
        <section
          id="languages"
          style={{ display: 'flex' }}
          aria-label={t('languageSelection')}
        >
          {languageElements()}
        </section>
        <section id="links" style={{ display: 'flex' }} aria-label={t('links')}>
          {linkElements()}
        </section>
        <></>
      </div>
    </Modal>
  );
};
export default withTranslation('translations')(BurgerMenu);
