import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { getPrimaryColor } from '../util/getConfig';

const Breadcrumbs = () => {
  const [t] = useTranslation();
  const parser = document.createElement('a');
  parser.href = window.location.href;
  const arr = parser.pathname.split('/');
  const isModify = window.location.href.indexOf('cont=') !== -1;
  const crumbs = arr.map(path => {
    switch (path) {
      case 'createView':
      case 'createstaticview':
        return !isModify ? t('breadCrumbsCreate') : t('breadCrumbsModify');
      case 'monitors':
        return t('breadCrumbsOwnMonitors');
      case '':
        return null; //t('breadCrumbsFrontPage');
      default:
        return null;
    }
  });

  return (
    <div className="breadcrumbs-container">
      <div className="crumbs">
        {crumbs.map((crumb, i) => {
          if (i === 0) {
            crumb = 'breadCrumbsFrontPage';
          }
          return (
            <>
              {i !== 0 && (
                <Icon
                  img={'arrow-down'}
                  width={14}
                  height={14}
                  rotate={'-90'}
                  color={getPrimaryColor()}
                  margin={'0 10px'}
                />
              )}
              {i === crumbs.length - 1 ? (
                t(crumb)
              ) : (
                <Link className="to-home" to={`/${arr[i]}`}>
                  {t(crumb)}
                </Link>
              )}
            </>
          );
        })}
      </div>
      <span className="main-header">{t(crumbs[crumbs.length - 1])}</span>
    </div>
  );
};

export default Breadcrumbs;
