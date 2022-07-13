import React, { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../App';

interface IProps {
  show: boolean;
  buttonTranslationKey?: string;
  createNew?: boolean;
}
const MonitorOverlay: FC<IProps> = ({
  show,
  buttonTranslationKey,
  createNew,
}) => {
  const { t } = useTranslation();
  const user = useContext(UserContext);
  let text = t(buttonTranslationKey) || t('edit-display');
  let to;
  if (createNew) {
    to = '/createView';
  } else {
    if (!user?.sub) {
      if (window.location.href.indexOf('cont=') !== -1) {
        to = `/createView${window.location.search}`;
      } else {
        to = '/';
        text = t('login');
      }
    } else {
      if (window.location.href.indexOf('url=') !== -1) {
        to = `/monitors/createView${window.location.search}`;
      } else {
        to = '/monitors/createView';
      }
    }
  }

  return (
    <div className={cx('monitor-overlay', show ? 'show' : 'hide')}>
      <Link className="link" to={to}>
        <span>{text}</span>
      </Link>
    </div>
  );
};

export default MonitorOverlay;
