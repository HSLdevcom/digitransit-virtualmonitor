import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';

interface IProps {
  show: boolean;
  isPreview: boolean;
  staticContentHash?: string;
  staticUrl?: string;
  staticViewTitle?: string;
}
const MonitorOverlay: FC<IProps & WithTranslation> = ({
  isPreview,
  show,
  staticUrl,
  staticViewTitle,
  staticContentHash,
  t,
}) => {
  return (
    <>
      {!isPreview && (
        <div className={cx('monitor-overlay', show ? 'show' : 'hide')}>
          <Link
            className="link"
            to={
              !staticUrl
                ? `/createView${window.location.search}`
                : `/createStaticView?name=${staticViewTitle}&url=${staticUrl}&cont=${staticContentHash}`
            }
          >
            <span>{t('edit-display')}</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default withTranslation('translations')(MonitorOverlay);
