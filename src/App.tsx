import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo'
import './App.css';

import VirtualMonitor from 'src/ui/VirtualMonitor'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  }),
})

class App extends React.Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <VirtualMonitor title={'Jokupysäkki'} />
      </ApolloProvider>
    );
  }
}

export default App;
