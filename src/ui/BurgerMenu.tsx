import React, { useEffect } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IMonitorConfig } from '../App';
import Icon from './Icon';
import { slide as Menu } from 'react-burger-menu';
import { getPrimaryColor } from '../util/getConfig';

interface Props {
  config?: IMonitorConfig;
  user?: any; // todo: refactor when we have proper user
}

const BurgerMenu: React.FC<Props & WithTranslation> = (
  { config, user, t, i18n }
) => {
  const changeLanguage = (i18n, lang) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    const classNames = ['.bm-item', '.bm-cross-button'];
    const attributesWithValues = [
      [{ name: 'aria-hidden', value: 'true' }, { name: 'tabindex', value: '-1' }],
      [{ name: 'aria-hidden', value: 'false' }, { name: 'aria-label', value: t('menuClose') }, { name: 'role', value: 'button' }]
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
    <Menu
      right
      width="400px"
      customCrossIcon={
        <Icon img="close" color={getPrimaryColor()} width={25} />
      }
      disableAutoFocus
    >
      <div id="languages" style={{ display: 'flex' }} tabIndex={ -1 }>
        <Link className="lang-select" onClick={() => changeLanguage(i18n, 'fi')} to={window.location.pathname} aria-label={t('changeLanguage', { language: t('languageNameFi') })}>
          FI
        </Link>
        <Link className="lang-select" onClick={() => changeLanguage(i18n, 'sv')} to={window.location.pathname} aria-label={t('changeLanguage', { language: t('languageNameSv') })}>
          SV
        </Link>
        <Link className="lang-select" onClick={() => changeLanguage(i18n, 'en')} to={window.location.pathname} aria-label={t('changeLanguage', { language: t('languageNameEn') })}>
          EN
        </Link>
      </div>
      <div id="links" style={{ display: 'flex' }} tabIndex={ -1 }>
        <Link className="link" to={'/'}>
          {t('breadCrumbsFrontPage')}
        </Link>
        <Link
          className="link"
          to={
            user && user.loggedIn
              ? '/createStaticView'
              : '/createView'
          }
        >
          {t('createViewTitle')}
        </Link>
        <Link className="link" to={'/help'}>
          {t('breadCrumbsHelp')}
        </Link>
      </div>
      <></>
    </Menu>
  );
};
export default withTranslation('translations')(BurgerMenu);
