import * as React from 'react';
import './Banner.scss';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from "./Icon";
import Logo from './logo/Logo';
import { slide as Menu } from 'react-burger-menu';
interface Props {
  config?: any;
}
const Banner: React.FC<Props & WithTranslation> = (
  props: Props & WithTranslation,
) => {
  const changeLanguage = (i18n, lang) => {
    i18n.changeLanguage(lang);
  };
  return (
    <div className="banner">
      <Logo monitorConfig={props.config} />
      <Menu right width="400px" customCrossIcon={<Icon img="close"  color="#1c57cf" width={25} />}>
        <div className="lang-section">
          <span
            className="lang-select"
            onClick={() => changeLanguage(props.i18n, 'fi')}
          >
            {' '}
            FI{' '}
          </span>
          <span
            className="lang-select"
            onClick={() => changeLanguage(props.i18n, 'sv')}
          >
            {' '}
            SV{' '}
          </span>
          <span
            className="lang-select"
            onClick={() => changeLanguage(props.i18n, 'en')}
          >
            {' '}
            EN{' '}
          </span>
        </div>
        <div className="link-section">
          <Link className="link" to={'/'}>{'Etusivu'}</Link>
          <Link className="link" to={'/createView'}>{props.t('quickDisplayCreate')}</Link>
          <Link className="link" to={'/help'}>{'Apua'}</Link>
        </div>
      </Menu>
    </div>
  );
};
export default withTranslation('translations')(Banner);
