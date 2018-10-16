import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation, Query } from '@loona/react';

import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';
import { IConfiguration, IDisplay } from 'src/ui/ConfigurationList';
import { QueryResult } from 'react-apollo';
import DisplayEditor from 'src/ui/DisplayEditor';
import { DisplayFieldsFragment } from 'src/ui/ConfigurationRetriever';

const addQuickConfiguration = gql`
  mutation addQuickConfiguration {
    addQuickConfiguration @client {
      id
      name
      displays {
        id
        name
        viewCarousel {
          id
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

interface IQuickDisplayState {
  displayId?: string,
};
class DisplayQuery extends Query<{ display: IDisplay }, { id: string }> {}

class QuickDisplay extends React.Component<{}, IQuickDisplayState> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  async addQuickConfiguration2(addQuickConfiguration: any) {
    const { data, errors }: { data?: { addQuickConfiguration: IConfiguration }, errors?: any } = await addQuickConfiguration();
    if (errors) {
      throw new Error(errors);
    }
    if (data && (Object.values(data.addQuickConfiguration.displays).length > 0)) {
      this.setState({
        displayId: Object.values(data.addQuickConfiguration.displays)[0].id,
      });
    } else {
      this.setState({
        displayId: undefined,
      });
    }
  }

  public render() {
    return (
      <ApolloClientsContext.Consumer>
        {({ virtualMonitor }) =>
          (<>
            <Mutation
              mutation={addQuickConfiguration}
              client={virtualMonitor}
            >
              {addQuickConfiguration => (
                <button onClick={() => this.addQuickConfiguration2(addQuickConfiguration)} value={'Create'}>
                  Create a new Quick Display
                </button>
              )}
            </Mutation>
            {this.state.displayId
              ? (
                <DisplayQuery
                  client={virtualMonitor}
                  query={gql`
                    ${DisplayFieldsFragment}

                    query GetDisplay($id: ID!){
                      display(id: $id) @client {
                        id
                        ...on Display {
                          ...displayFields
                        }
                      }
                    }
                  `}
                  variables={{
                    id: this.state.displayId
                  }}
                >
                  {(result: QueryResult<{ display: IDisplay }>): React.ReactNode => {
                    if (result.loading) {
                      return (<div>Ladataan...</div>)
                    }
                    if (result.error) {
                      return (<div>Virhe: {result.error.message}</div>)
                    }
                    if (!result.data) {
                      return (<div>Väliaikaisen näytön luonti epäonnistui</div>)
                    }
                    return (
                      <DisplayEditor
                        display={result.data.display}
                      />
                    );
                  }}
                </DisplayQuery>
              )
              : null
            }
          </>)
        }
      </ApolloClientsContext.Consumer>
    );
  }
}

export default QuickDisplay;
