import React from 'react';
import Banner from './ui/Banner';
import Breadcrumbs from './ui/Breadcrumbs';
import IndexPage from './ui/IndexPage';
import UserMonitors from './ui/UserMonitors';
interface IProps {
  login: boolean;
  config: any;
}
const LandingPage: React.FC<IProps> = props => {
  // ---------- TODO: POC / DEBUG PURPOSES ONLY ----------
  const user = {
    loggedIn: props.login,
    urls: ['abcdef', 'ghijk'],
  };
  // ----------                                 ----------
  const logIn =
    user.loggedIn && user.urls.length > 0 && props.config.allowLogin;
  return (
    <>
      <section aria-label="navigation">
        <Banner config={props.config} user={user} />
        <Breadcrumbs
          isLogged={user.loggedIn && props.config.allowLogin}
          start={props.config.breadCrumbsStartPage}
        />
      </section>
      <section role="main" id="mainContent">
        {logIn && <UserMonitors user={user} />}
        {!logIn && <IndexPage />}
      </section>
    </>
  );
};

export default LandingPage;
