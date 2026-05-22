import React, { useContext } from 'react';
import { ConfigContext, UserContext } from './contexts';
import BannerContainer from './ui/BannerContainer';
import FooterContainer from './ui/FooterContainer';
import IndexPage from './ui/IndexPage';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getLoginUri } from './util/getResources';

const LandingPage = () => {
  const [t] = useTranslation();
  const user = useContext(UserContext);
  const config = useContext(ConfigContext);
  const logIn = user.sub && config.login.inUse;
  const loginURI = getLoginUri(config.name);

  const buttons = (
    <>
      {config.login.inUse ? (
        <>
          <a href={loginURI} aria-label={t('front-page-sign-in-button')}>
            <div className="monitor-button blue">
              {t('front-page-sign-in-button')}
            </div>
          </a>
          <Link
            to={'/createview'}
            aria-label={t('front-page-no-sign-in-button')}
          >
            <div className="monitor-button white">
              {t('front-page-no-sign-in-button')}
            </div>
          </Link>
        </>
      ) : (
        <Link
          to={'/createview'}
          id="create-new-link"
          className="monitor-button blue"
        >
          {t('quickDisplayCreate')}
        </Link>
      )}
    </>
  );
  return (
    <>
      <BannerContainer />
      <main id="mainContent">
        {logIn ? (
          <Redirect
            to={{
              pathname: '/monitors',
            }}
          />
        ) : (
          <IndexPage buttons={buttons} renderLogInMessage />
        )}
      </main>
      <FooterContainer />
    </>
  );
};

export default LandingPage;
