import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ContentContainer from './ContentContainer';
import NysseLaptop from './icons/nysse-reittiopas.jpg';
import './IndexPage.scss';

function IndexPage(props: WithTranslation) {
  const title = props.t('title');
  const t1 = props.t('frontPageParagraph1');
  const t2 = props.t('frontPageParagraph2');
  const t3 = props.t('frontPageParagraph3');

  return (
    <div id={'stop-search'} className={'index'}>
      <ContentContainer longContainer>
        <div className="left">
          <h1 className="title">{title}</h1>
          <div className={'welcome'}>
            <p className={'welcome-text'}>
              {' '}
              {t1} <br />
              <br /> {t2} <br />
              <br /> {t3}
            </p>
          </div>
          <div className="button-container">
            <Link to={'/createView'}>
              <button className="create-new">
                {props.t('quickDisplayCreate')}
              </button>
            </Link>
          </div>
        </div>
        <div className="right">
          <img className={'desktop-img'} src={NysseLaptop} alt="" />
        </div>
      </ContentContainer>
    </div>
  );
}

export default withTranslation('translations')(IndexPage);
