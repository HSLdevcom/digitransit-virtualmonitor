import React, { FC } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { getPrimaryColor } from '../util/getConfig';

interface IProps {
  isLogged?: boolean;
  start?: string;
}
const Breadcrumbs: FC<IProps & WithTranslation> = ({ isLogged, start, t }) => {
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
    case 'help':
      crumb = t('breadCrumbsHelp');
      break;
    default:
      crumb = isLogged
        ? t('breadCrumbsOwnMonitors')
        : start === 'front'
        ? t('breadCrumbsFrontPage')
        : null;
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
          />
        )}
        {crumb}
      </div>
      <span className="desc">
        {crumb !== t('breadCrumbsFrontPage') ? crumb : null}
      </span>
    </div>
  );
};

export default withTranslation('translations')(Breadcrumbs);
