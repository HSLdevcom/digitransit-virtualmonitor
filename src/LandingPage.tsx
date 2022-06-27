import React, { useContext } from 'react';
import { ConfigContext } from '.';
import { UserContext } from './App';
import BannerContainer from './ui/BannerContainer';
import IndexPage from './ui/IndexPage';
import UserMonitors from './ui/UserMonitors';

const LandingPage = () => {

  const user = useContext(UserContext);
  const config = useContext(ConfigContext);
  const logIn =
    user.loggedIn && user.urls.length > 0 && config.allowLogin;
  return (
    <>
      <BannerContainer />
      <section role="main" id="mainContent">
        {logIn && <UserMonitors />}
        {!logIn && <IndexPage />}
      </section>
    </>
  );
};

export default LandingPage;
