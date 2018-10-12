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

class QuickDisplay extends React.Component<{}, { show: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      show: false,
    };
  }

  show() {
    this.setState({ show: true });
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
        <button onClick={this.show.bind(this)} value={'Create'}>
          Show
        </button>
        { this.state.show
          ? (<ConfigurationList />)
          : null
        }
      </>
    );
  }  
}

export default QuickDisplay;
