import * as React from 'react';

export interface INtpSyncContext {
  deltaMilliseconds: number;
}

export default React.createContext({
  deltaMilliseconds: 0,
});
