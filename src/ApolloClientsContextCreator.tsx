import * as React from 'react';

export interface IApolloClientContextType {
  // default: ReturnType<typeof ApolloBoostClient>,
  // [otherClients: string]: ReturnType<typeof ApolloBoostClient>,
  default?: any;
  [otherClients: string]: any;
}

export default (contexts: IApolloClientContextType) =>
  React.createContext(contexts);
