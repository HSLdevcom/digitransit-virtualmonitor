import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import 'src/App.css';
import HslLogo from 'src/ui/HslLogo';
import StopSelector from 'src/ui/StopSelector';
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
    displayedRoutes={match.params.displayedRoutes}
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
              path={'/stop/:stopId/:displayedRoutes?'}
              component={RouteWrapper}
            />
            <Route>
              <div>
                <HslLogo />
                Anna pysäkki parametrina.
                <Switch>
                  <Route
                    path={'/searchStop/:phrase?'}
                    component={StopSelector}
                  />
                  <Route
                    component={StopSelector}
                  />
                </Switch>
              </div>
            </Route>
          </Switch>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
