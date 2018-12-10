import * as React from "react";

export interface INtpSyncContext {
  delta: number,
};

export default React.createContext({
  delta: 0,
});
