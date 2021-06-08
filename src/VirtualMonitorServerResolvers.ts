import { ApolloCache } from 'apollo-cache';

import { IConfiguration } from './ui/ConfigurationList';

const resolvers = {
  Mutation: {
    // addStop: (_: any, { configuration, display }: { configuration: string, display: string }, { cache, getCacheKey }: any) => {
    //   cache.writeData();
    //   return null;
    // },
    createDisplay: (
      _: any,
      { configurationName, name }: { configurationName: string; name: string },
      { cache, getCacheKey }: { cache: ApolloCache<any>; getCacheKey: any },
    ) => {
      return null;
    },
    createLocalConfiguration: (
      _: any,
      { name }: { name: string },
      { cache, getCacheKey }: { cache: ApolloCache<any>; getCacheKey: any },
    ) => {
      return null;
    },
    modifyLocalConfigurations: (
      _: any,
      { configuration }: { configuration: IConfiguration },
      { cache, getCacheKey }: { cache: ApolloCache<any>; getCacheKey: any },
    ) => {
      return null;
    },
  },
};

export default resolvers;
