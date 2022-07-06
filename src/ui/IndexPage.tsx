import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ContentContainer from './ContentContainer';
import monitorsImage from './icons/create-monitor.svg';
import cx from 'classnames';
import { ConfigContext } from '../contexts';

const IndexPage = () => {
  const { t, i18n } = useTranslation();
  const config = useContext(ConfigContext);
  return (
    <ContentContainer longContainer>
      <div className="index">
        <div className="left">
          <div className="welcome">
            <h1 className={cx('text', 'bigger')}>{t('frontPageParagraph1')}</h1>
            <div className="text">{t('frontPageParagraph2')}</div>
            <div className="text">{t('frontPageParagraph3')}</div>
            {config.frontPageContent &&
              config.frontPageContent.map(text => {
                return <div className="text bold">{text[i18n.language]}</div>;
              })}
            <div className="button-container" tabIndex={-1}>
              {config.allowLogin ? (
                <>
                  <a
                    href={'login?url=/&'}
                    aria-label={t('front-page-sign-in-button')}
                  >
                    <div className="monitor-button blue">
                      {t('front-page-sign-in-button')}
                    </div>
                  </a>
                  <Link
                    to={'/createView'}
                    aria-label={t('front-page-no-sign-in-button')}
                  >
                    <div className="monitor-button white">
                      {t('front-page-no-sign-in-button')}
                    </div>
                  </Link>
                </>
              ) : (
                <Link
                  to={'/createView'}
                  id="create-new-link"
                  aria-label={t('quickDisplayCreate')}
                >
                  <button className="monitor-button blue">
                    {t('quickDisplayCreate')}
                  </button>
                </Link>
              )}
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
