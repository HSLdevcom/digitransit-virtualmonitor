import React, { FC } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from './Icon';

/*const routes = [
  { path: '/', breadcrumb: i18n.t('breadCrumbsHome') },
  { path: '/createView', breadcrumb: i18n.t('breadCrumbsCreate') },
  { path: '/help', breadcrumb: i18n.t('breadCrumbsHelp') },
];*/
interface IProps {
  isLogged?: boolean;
}
const Breadcrumbs: FC<IProps & WithTranslation> = ({ isLogged, t }) => {
  const parser = document.createElement('a');
  parser.href = window.location.href;
  const arr = parser.pathname.split('/');
  const path = arr[1] ? arr[1].toLowerCase() : null;
  const isModify =
    arr.length > 2 || window.location.href.indexOf('?cont=') !== -1;
  let crumb;

  switch (path) {
    case 'createview':
      crumb = !isModify ? t('breadCrumbsCreate') : t('breadCrumbsModify');
      break;
    case 'help':
      crumb = t('breadCrumbsHelp');
      break;
    default:
      crumb = isLogged ? t('breadCrumbsOwnMonitors') : null;
  }
  return (
    <div className="breadcrumbs-container">
      <div className="crumbs">
        <Link className="to-home" to={'/'}>
          {!isLogged ? t('breadCrumbsHome') : t('breadCrumbsSite')}
        </Link>
        {isLogged && (
          <>
            <Icon
              img={'arrow-down'}
              width={14}
              height={14}
              rotate={'-90'}
              color={'#007ac9'}
            />
            <Link className="to-home" to={'/?pocLogin'}>
              {t('breadCrumbsOwnMonitors')}
            </Link>
          </>
        )}
        <Icon
          img={'arrow-down'}
          width={14}
          height={14}
          rotate={'-90'}
          color={'#007ac9'}
        />
        {crumb}
      </div>
      <span className="desc"> {!isModify ? t('breadCrumbsCreate') : t('breadCrumbsModify')}</span>
    </div>
  );
};

export default withTranslation('translations')(Breadcrumbs);
