import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation, Query } from '@loona/react';

import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';
import ConfigurationList from 'src/ui/ConfigurationList';
import { supportsGoWithoutReloadUsingHash } from 'history/DOMUtils';
import { QueryResult } from 'react-apollo';

const addQuickConfiguration = gql`
  mutation addQuickConfiguration {
    addQuickConfiguration @client {
      id
      name
      displays {
        id
        name
        viewCarousel {
          displaySeconds
          view {
            id
            type
            ...on StopTimesView {
              title {
                fi
              }
              stops
            }
          }
        }
      }
    }
  }
`;

class QuickDisplay extends React.Component {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <>
        <ApolloClientsContext.Consumer>
          {({ virtualMonitor }) =>
            (<Mutation
              mutation={addQuickConfiguration}
              client={virtualMonitor}
            >
              {addQuickConfiguration => (
                <button onClick={() => addQuickConfiguration()} value={'Create'}>
                  Create a new Quick Display
                </button>
              )}
            </Mutation>)
          }
        </ApolloClientsContext.Consumer>
        <ConfigurationList />
      </>
    );
  }
}

export default QuickDisplay;
