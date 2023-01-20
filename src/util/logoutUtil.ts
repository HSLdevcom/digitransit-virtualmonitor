const logoutChannel = new BroadcastChannel('logout');

export const logout = setUser => {
  logoutChannel.postMessage('Logout');
  setUser({});
};

export const listenForLogoutAllTabs = setUser => {
  logoutChannel.onmessage = () => {
    logout(setUser);
    logoutChannel.close();
  };
};
