import React, { useContext } from 'react';
import { ConfigContext } from '.';
import { UserContext } from './App';
import BannerContainer from './ui/BannerContainer';
import IndexPage from './ui/IndexPage';
import { Redirect } from 'react-router-dom';

const LandingPage = () => {

  const user = useContext(UserContext);
  const config = useContext(ConfigContext);
  const logIn =
    user.sub && config.allowLogin;
  return (
    <>
      <BannerContainer />
      <section role="main" id="mainContent">
      {logIn ? <Redirect
        to={{
          pathname: '/monitors',
        }}
      /> : 
        <IndexPage />}
      </section>
    </>
  );
};

export default LandingPage;
