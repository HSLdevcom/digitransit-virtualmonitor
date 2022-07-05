import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { getPrimaryColor } from '../util/getConfig';

interface IProps {
  isLogged?: boolean;
  start?: string;
}
const Breadcrumbs: FC<IProps> = ({ isLogged, start }) => {
  const [t] = useTranslation();
  const parser = document.createElement('a');
  parser.href = window.location.href;
  const arr = parser.pathname.split('/');
  const path = arr[1] ? arr[1].toLowerCase() : null;
  const isModify =
    arr.length > 2 || window.location.href.indexOf('cont=') !== -1;
  let crumb;
  switch (path) {
    case 'createview':
    case 'createstaticview':
      crumb = !isModify ? t('breadCrumbsCreate') : t('breadCrumbsModify');
      break;
    case 'monitors':
      crumb = t('breadCrumbsOwnMonitors');

      break;
    default:
      crumb = null;
  }

  return (
    <div className="breadcrumbs-container">
      <div className="crumbs">
        {start === 'site' && (
          <Link className="to-home" to={'/'}>
            {t('breadCrumbsSite')}
          </Link>
        )}
        {start === 'front' && path && (
          <Link className="to-home" to={'/'}>
            {t('breadCrumbsFrontPage')}
          </Link>
        )}
        {isLogged &&
          crumb !== t('breadCrumbsOwnMonitors') &&
          crumb !== t('breadCrumbsHelp') && (
            <>
              <Icon
                img={'arrow-down'}
                width={14}
                height={14}
                rotate={'-90'}
                color={getPrimaryColor()}
                margin={'0 10px'}
              />
              <Link className="to-home" to={'/?pocLogin'}>
                {t('breadCrumbsOwnMonitors')}
              </Link>
            </>
          )}
        {crumb !== t('breadCrumbsFrontPage') && (
          <Icon
            img={'arrow-down'}
            width={14}
            height={14}
            rotate={'-90'}
            color={getPrimaryColor()}
            margin={'0 10px'}
          />
        )}
        {crumb}
      </div>
      <span className="main-header">{t(crumb)}</span>
    </div>
  );
};

export default Breadcrumbs;
