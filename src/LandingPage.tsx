import React from 'react';
import BannerContainer from './ui/BannerContainer';
import IndexPage from './ui/IndexPage';
import UserMonitors from './ui/UserMonitors';
interface IProps {
  login: boolean;
  config: any;
}
const LandingPage: React.FC<IProps> = ({config, login}) => {
  // ---------- TODO: POC / DEBUG PURPOSES ONLY ----------
  const user = {
    loggedIn: login,
    urls: ['abcdef', 'ghijk'],
  };
  // ----------                                 ----------
  const logIn =
    user.loggedIn && user.urls.length > 0 && config.allowLogin;
  return (
    <>
      <BannerContainer login={logIn} config={config}/>
      <section role="main" id="mainContent">
        {logIn && <UserMonitors user={user} />}
        {!logIn && <IndexPage />}
      </section>
    </>
  );
};

export default LandingPage;
