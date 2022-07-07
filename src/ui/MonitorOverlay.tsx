import React, { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../App';

interface IProps {
  show: boolean;
  isPreview: boolean;
  buttonTranslationKey?: string;
  createNew?: boolean;
}
const MonitorOverlay: FC<IProps> = ({
  isPreview,
  show,
  buttonTranslationKey,
  createNew,
}) => {
  const { t } = useTranslation();
  const user = useContext(UserContext);
  const text = t(buttonTranslationKey) || t('edit-display');
  const to = createNew
    ? '/createView'
    : window.location.href.indexOf('cont=') !== -1 && !user?.sub
    ? `/createView${window.location.search}`
    : `/monitors/createView${window.location.search}`;
  return (
    <>
      {!isPreview && (
        <div className={cx('monitor-overlay', show ? 'show' : 'hide')}>
          <Link className="link" to={to}>
            <span>{text}</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default MonitorOverlay;
