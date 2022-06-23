import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ContentContainer from './ContentContainer';
import monitorsImage from './icons/create-monitor.svg';
import cx from 'classnames';

const IndexPage = () => {
  const { t } = useTranslation();
  return (
    <ContentContainer longContainer>
      <div className="index">
        <div className="left">
          <div className="welcome">
            <h1 className={cx('text', 'bigger')}>{t('frontPageParagraph1')}</h1>
            <div className="text">{t('frontPageParagraph2')}</div>
            <div className="text">{t('frontPageParagraph3')}</div>
            <div className="button-container" tabIndex={-1}>
              <Link
                to={'/createView'}
                id="create-new-link"
                aria-label={t('quickDisplayCreate')}
              >
                <button className="create-new">
                  {t('quickDisplayCreate')}
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="right">
          <img
            className={'desktop-img'}
            src={monitorsImage}
            alt="monitor-image"
          />
        </div>
      </div>
    </ContentContainer>
  );
};

export default IndexPage;
