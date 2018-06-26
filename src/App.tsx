import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';

import VirtualMonitor from 'src/ui/VirtualMonitor'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  }),
})

const RouteWrapper = ({ match }: any) => (
  <VirtualMonitor
    stops={[match.params.stopId]}
    // title={'Jokupysäkki'}
  />
);

class App extends React.Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Route
            path={'/stop/:stopId'}
            component={RouteWrapper}
          />
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
