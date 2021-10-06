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
  const logIn = user.loggedIn && user.urls.length > 0;
  return (
    <>
      <Banner config={props.config} user={user} />
      <Breadcrumbs isLogged={user.loggedIn} />
      {logIn && <UserMonitors user={user} />}
      {!logIn && <IndexPage />}
    </>
  );
};

export default LandingPage;
