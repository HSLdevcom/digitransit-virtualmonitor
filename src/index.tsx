import ApolloBoostClient, { InMemoryCache } from 'apollo-boost';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo'
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import App from 'src/App';
import confs from 'src/configPlayground';
import i18n from 'src/i18n';
import 'src/index.css';
import registerServiceWorker from 'src/registerServiceWorker';

const apolloCache = new InMemoryCache();

const resolvers = {
  Mutation: {
    addStop: (_: any, { configuration, display }: { configuration: string, display: string }, { cache, getCacheKey }: any) => {
      cache.writeData();
      return null;
    },
  }
}; 

const client = new ApolloBoostClient({
  cache: apolloCache,
  clientState: {
    defaults: confs,
    resolvers
  },
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
});

ReactDOM.render(
  (<I18nextProvider i18n={i18n}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </I18nextProvider>),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
