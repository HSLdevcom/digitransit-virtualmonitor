import React, { FC } from 'react';
import './Breadcrumbs.scss';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import i18n from '../i18n';
import Icon from './Icon';

/*const routes = [
  { path: '/', breadcrumb: i18n.t('breadCrumbsHome') },
  { path: '/createView', breadcrumb: i18n.t('breadCrumbsCreate') },
  { path: '/help', breadcrumb: i18n.t('breadCrumbsHelp') },
];*/

const Breadcrumbs: FC<WithTranslation> = props => {
  const parser = document.createElement('a');
  parser.href = window.location.href;
  const arr = parser.pathname.split('/');
  const path = arr[1] ? arr[1] : null;
  let crumb;
  switch (path) {
    case 'createView':
      crumb = props.t('breadCrumbsCreate');
      break;
    case 'help':
      crumb = props.t('breadCrumbsHelp');
      break;
    case 'user':
      crumb = 'Omat pysäkkinäytöt';
      break;
    default:
      crumb = null;
  }
  return (
    <div className="breadcrumbs-container">
      <div className="crumbs">
        <Link className="to-home" to={'/'}>
          {' '}
          {props.t('breadCrumbsHome')}{' '}
        </Link>{' '}
        <Icon
          img={'arrow-down'}
          width={14}
          height={14}
          rotate={'-90'}
          color={'#007ac9'}
        />{' '}
        {crumb}
      </div>
      <span className="desc"> {props.t('createStopView')}</span>
    </div>
  );
};

export default withTranslation('translations')(Breadcrumbs);
