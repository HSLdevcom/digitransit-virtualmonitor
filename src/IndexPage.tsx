import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ContentContainer from './ContentContainer';
import NysseLaptop from './ui/icons/nysse-reittiopas.jpg';
import './IndexPage.scss';

class IndexPage extends React.Component<WithTranslation, any> {
  render() {
    const title = this.props.t('title');
    const t1 = this.props.t('frontPageParagraph1');
    const t2 = this.props.t('frontPageParagraph2');
    const t3 = this.props.t('frontPageParagraph3');

    return (
      <div id={'stop-search'} className={'index'}>
        <ContentContainer>
          <div className="left">
            <h1 className="title">{title}</h1>
            <div className={'welcome'}>
              <p className={'welcome-text'}>
                {' '}
                {t1} <br />
                <br /> {t2} <br />
                <br /> {t3}
              </p>
              <button className="todisplay">
                <Link to={'/quickDisplay'}>
                  {this.props.t('quickDisplayCreate')}
                </Link>
              </button>
            </div>
          </div>
          <div className="right">
            <img className={'desktop-img'} src={NysseLaptop} alt="" />
          </div>
        </ContentContainer>
      </div>
    );
  }
}
export default withTranslation('translations')(IndexPage);
