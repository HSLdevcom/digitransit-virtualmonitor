import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { getPrimaryColor } from '../util/getConfig';
import { UserContext } from '../contexts';

const Breadcrumbs = () => {
  const [t] = useTranslation();
  const user = useContext(UserContext);
  const parser = document.createElement('a');
  parser.href = window.location.href;
  const arr = parser.pathname.split('/');
  const isModify =
    window.location.href.indexOf('cont=') !== -1 ||
    window.location.href.indexOf('url=') !== -1;

  if (arr.every(e => !e) && arr.length === 2) {
    arr.pop();
  }
  const crumbs = arr.map((path, i) => {
    switch (path) {
      case 'createview':
      case 'createstaticview':
        return !isModify ? 'breadCrumbsCreate' : 'breadCrumbsModify';
      case 'monitors':
        return 'breadCrumbsOwnMonitors';
      case '':
        return arr.length === 1 ? 'breadCrumbsCreate' : 'breadCrumbsFrontPage';
      default:
        return null;
    }
  });

  if (user.sub) {
    // if user is logged in we don't show front page in the breadcrumbs
    crumbs.shift();
  }

  return (
    <div className="breadcrumbs-container">
      <div className="crumbs">
        {crumbs.map((crumb, i) => {
          let path = arr[i];
          if (crumb === null) {
            crumb = 'breadCrumbsCreate';
            path = '';
          }
          return (
            <React.Fragment key={`crumb${i}`}>
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
                <Link className="to-home" to={`/${path}`}>
                  {t(crumb)}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <span className="main-header">{t(crumbs[crumbs.length - 1])}</span>
    </div>
  );
};

export default Breadcrumbs;
