import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ContentContainer from './ContentContainer';
import monitorsImage from './icons/create-monitor.svg';
import cx from 'classnames';

export function IndexPage(props: WithTranslation) {
  return (
    <ContentContainer longContainer>
      <div className="index">
        <div className="left">
          <div className="welcome">
            <h1 className={cx('text', 'bigger')}>
              {props.t('frontPageParagraph1')}
            </h1>
            <div className="text">{props.t('frontPageParagraph2')}</div>
            <div className="text">{props.t('frontPageParagraph3')}</div>
            <div className="button-container" tabIndex={-1}>
              <Link
                to={'/createView'}
                id="create-new-link"
                aria-label={props.t('quickDisplayCreate')}
              >
                <button className="create-new">
                  {props.t('quickDisplayCreate')}
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="right">
          <img className={'desktop-img'} src={monitorsImage} alt="monitor-image" />
        </div>
      </div>
    </ContentContainer>
  );
}

export default withTranslation('translations')(IndexPage);
