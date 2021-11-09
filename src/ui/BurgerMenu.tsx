import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { slide as Menu } from 'react-burger-menu';
import { getPrimaryColor } from '../util/getConfig';

interface Props {
  createStatic: boolean;
}

const toggleMenu = ({ isOpen }, t) => {
  const closeMenu = document.querySelector('#react-burger-cross-btn');
  if (closeMenu) {
    closeMenu.innerHTML = t('menuClose');
  }

  const elements = {
    '#create-new-link': [
      { name: 'aria-hidden', value: isOpen ? 'true' : 'false' },
      { name: 'tabindex', value: isOpen ? '-1' : '0' },
    ],
    '.create-new': [
      { name: 'aria-hidden', value: 'true' },
      { name: 'tabindex', value: '-1' },
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
};

const BurgerMenu: React.FC<Props & WithTranslation> = ({
  createStatic,
  t,
  i18n,
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

  return (
    <Menu
      right
      width="400px"
      customCrossIcon={
        <Icon img="close" color={getPrimaryColor()} width={25} />
      }
      disableAutoFocus
      noOverlay
      onStateChange={e => toggleMenu(e, t)}
    >
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
    </Menu>
  );
};
export default withTranslation('translations')(BurgerMenu);
