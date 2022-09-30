import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ContentContainer from './ContentContainer';
import monitorsImage from './icons/create-monitor.svg';
import cx from 'classnames';
import { ConfigContext } from '../contexts';

interface IProps {
  buttons: any;
  renderLogInMessage?: boolean;
}

const IndexPage: FC<IProps> = ({ buttons, renderLogInMessage = false }) => {
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
            <>
              {config.frontPageContent && renderLogInMessage && (
                <span className="text bold">
                  {t('front-page-paragraph-hsl')}
                </span>
              )}
            </>
            <div className="button-container" tabIndex={-1}>
              {buttons}
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
