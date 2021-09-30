import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import cx from 'classnames';

interface IProps {
  show: boolean;
  isPreview: boolean;
  staticContentHash?: string;
  staticUrl?: string;
  staticViewTitle?: string;
}
const MonitorOverlay: FC<IProps> = ({
  isPreview,
  show,
  staticUrl,
  staticViewTitle,
  staticContentHash,
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
            <Icon img="arrow-down" height={60} width={60} />
          </Link>
        </div>
      )}
    </>
  );
};

export default MonitorOverlay;
