function isRunningOnTV() {
  const ua = navigator.userAgent;
  return /SmartTV|Tizen|Web0S|NetCast|AppleTV|HbbTV|GoogleTV|Android TV|Roku/i.test(
    ua,
  );
}

const logoutChannel = !isRunningOnTV() ? new BroadcastChannel('logout') : null;

export const logout = setUser => {
  if (logoutChannel) {
    logoutChannel.postMessage('Logout');
  }
  setUser({});
};

export const listenForLogoutAllTabs = setUser => {
  if (logoutChannel) {
    logoutChannel.onmessage = () => {
      logout(setUser);
      logoutChannel.close();
    };
  }
};
