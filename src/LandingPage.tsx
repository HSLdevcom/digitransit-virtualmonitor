import React, { useContext } from 'react';
import { ConfigContext } from './contexts';
import { UserContext } from './App';
import BannerContainer from './ui/BannerContainer';
import IndexPage from './ui/IndexPage';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [t] = useTranslation();
  const user = useContext(UserContext);
  const config = useContext(ConfigContext);
  const logIn =
    user.sub && config.allowLogin;


  const buttons = (
    <>
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
    </>
  )
  return (
    <>
      <BannerContainer />
      <section role="main" id="mainContent">
      {logIn ? <Redirect
        to={{
          pathname: '/monitors',
        }}
      /> : 
        <IndexPage buttons={buttons} renderLogInMessage />}
      </section>
    </>
  );
};

export default LandingPage;
