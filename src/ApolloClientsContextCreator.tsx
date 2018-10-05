import * as React from "react";
// import ApolloBoostClient from "apollo-boost";

export interface IApolloClientContextType {
  // default: ReturnType<typeof ApolloBoostClient>,
  // [otherClients: string]: ReturnType<typeof ApolloBoostClient>,
  readonly default?: any,
  readonly [otherClients: string]: any,
};

export default (contexts: IApolloClientContextType) => React.createContext(contexts);
