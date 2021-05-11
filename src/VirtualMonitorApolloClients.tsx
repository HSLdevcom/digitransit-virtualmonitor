import ApolloBoostClient, { InMemoryCache } from 'apollo-boost';

import ApolloClientsContextCreator from './ApolloClientsContextCreator';

const apolloCache = new InMemoryCache();

// const resolvers = {
//   Mutation: {
//     addStop: (_: any, { configuration, display }: { configuration: string, display: string }, { cache, getCacheKey }: any) => {
//       cache.writeData();
//       return null;
//     },
//   }
// };

// const reittiOpasClient = new ApolloBoostClient({
//   cache: apolloCache,
//   clientState: {
//     defaults: {},
//     resolvers
//   },
//   uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
// });

// const virtualMonitorClient = new ApolloBoostClient({
//   cache: new InMemoryCache(),
//   uri: 'http://localhost:4000',
// });

export const ApolloClientsContext = ApolloClientsContextCreator({
  // default: reittiOpasClient,
  // reittiOpas: reittiOpasClient,
  // virtualMonitor: virtualMonitorClient,
});

export const Consumer = ApolloClientsContext.Consumer;
export const Provider = ApolloClientsContext.Provider;
