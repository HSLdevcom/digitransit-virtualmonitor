import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import HslLogo from 'src/ui/HslLogo';
import VirtualMonitor from 'src/ui/VirtualMonitor'
import StopSelector from './ui/StopSelector';

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
          <Switch>
            <Route
              path={'/stop/:stopId'}
              component={RouteWrapper}
            />
            <div>
              <HslLogo />
              Anna pysäkki parametrina.
              <Route
                path={'/searchStop/:phrase?'}
                component={StopSelector}
              />
            </div>
          </Switch>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
