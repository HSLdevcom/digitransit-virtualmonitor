import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IMonitorConfig } from '../App';
import Icon from './Icon';
import Logo from './logo/Logo';
import { slide as Menu } from 'react-burger-menu';
import { getPrimaryColor } from '../util/getConfig';

interface Props {
  config?: IMonitorConfig;
  user?: any; // todo: refactor when we have proper user
}
const Banner: React.FC<Props & WithTranslation> = (
  props: Props & WithTranslation,
) => {
  const changeLanguage = (i18n, lang) => {
    i18n.changeLanguage(lang);
  };
  return (
    <div className="banner">
      <Logo isLandscape monitorConfig={props.config} />
      <Menu
        right
        width="400px"
        customCrossIcon={
          <Icon img="close" color={getPrimaryColor()} width={25} />
        }
      >
        <div className="lang-section">
          <span
            className="lang-select"
            onClick={() => changeLanguage(props.i18n, 'fi')}
          >
            FI
          </span>
          <span
            className="lang-select"
            onClick={() => changeLanguage(props.i18n, 'sv')}
          >
            SV
          </span>
          <span
            className="lang-select"
            onClick={() => changeLanguage(props.i18n, 'en')}
          >
            EN
          </span>
        </div>
        <div className="link-section">
          <Link className="link" to={'/'}>
            {props.t('breadCrumbsHome')}
          </Link>
          <Link
            className="link"
            to={
              props.user && props.user.loggedIn
                ? '/createStaticView'
                : '/createView'
            }
          >
            {props.t('createViewTitle')}
          </Link>
          <Link className="link" to={'/help'}>
            {props.t('breadCrumbsHelp')}
          </Link>
        </div>
      </Menu>
    </div>
  );
};
export default withTranslation('translations')(Banner);
