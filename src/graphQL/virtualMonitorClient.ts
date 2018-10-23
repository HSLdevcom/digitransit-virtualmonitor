import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createLoona, LoonaProvider, state, mutation, Context } from '@loona/react';
import { HttpLink } from 'apollo-link-http';

const virtualMonitorCache = new InMemoryCache({
  cacheRedirects: { 
    Query: {
      display: (_: any, { id }: { id: string }, context: Context) => {
        return context.getCacheKey({ __typename: 'Display', id });
      }
    },
  },
});

export const loona = createLoona(virtualMonitorCache);

export const virtualMonitorClient = new ApolloClient({
  cache: virtualMonitorCache,
  link: ApolloLink.from([
    loona,
    new HttpLink({
      uri: 'http://localhost:4000',
    })
  ]),
});
(virtualMonitorClient as any).name = 'VirtualMonitorClient';
