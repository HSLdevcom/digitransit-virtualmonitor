import React, { FC, useEffect, useState } from 'react';
import NtpSyncContext from './NtpSyncContext';

const NtpSyncComponent: FC = props => {
  const [deltaMilliseconds, setDeltaMilliseconds] = useState(0);
  const retrieveTimeDelta = async () => {
    try {
      const res = await fetch('https://use.ntpjs.org/v1/time.json');
      const remoteTime = await res.json();
      if (remoteTime.now) {
        setDeltaMilliseconds(remoteTime.now * 1000 - new Date().getTime());
      } else {
        setDeltaMilliseconds(0);
      }
    } catch (e) {
      setDeltaMilliseconds(0);
    }
  };
  useEffect(() => {
    retrieveTimeDelta();
  }, []);

  return (
    <NtpSyncContext.Provider value={deltaMilliseconds}>
      {props.children}
    </NtpSyncContext.Provider>
  );
};

export default NtpSyncComponent;
