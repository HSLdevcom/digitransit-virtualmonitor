import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation, Query } from '@loona/react';

import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';
import { IConfiguration, IDisplay } from 'src/ui/ConfigurationList';
import { QueryResult } from 'react-apollo';
import DisplayEditor from 'src/ui/DisplayEditor';
import { DisplayFieldsFragment } from 'src/ui/ConfigurationRetriever';
import { pairs } from 'src/ui/DisplayUrlCompression';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';

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

interface ICompressedDisplayRouteParams {
  version: string,
  packedDisplay: string
};

type IQuickDisplayProps = RouteComponentProps<ICompressedDisplayRouteParams>;

interface IQuickDisplayState {
  displayId?: string,
};
class DisplayQuery extends Query<{ display: IDisplay }, { id: string }> {}

class QuickDisplay extends React.Component<IQuickDisplayProps, IQuickDisplayState> {
  constructor(props: IQuickDisplayProps) {
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
                    console.log('Rendering a DisplayEditor');
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
                      <DisplayEditorHistoryUpdater
                        display={result.data.display}
                        history={this.props.history}
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

class DisplayEditorHistoryUpdater extends React.PureComponent<{display: IDisplay, history: History}> {
  constructor({ display, history }: {display: IDisplay, history: History}) {
    super({ display, history });
  }

  // Removes IDs and __typenames from the display.
  static minimizeDisplay(display: IDisplay): IDisplay {
    const removeIDAndTypename = (o: { id?: string, __typename?: string }): {  } => {
      const { id, __typename, ...rest } = o;
      return rest;
    }
    const recursive = (o: {}): {} => {
      return (
        Object.getOwnPropertyNames(removeIDAndTypename(o)).map(propName =>
          [
            propName,
            (typeof o[propName] === 'object')
              ? recursive(o[propName])
              : o[propName]
          ]
        ).reduce(
          (acc: {}, [propName, propValue]) => ({ ...acc, [propName]:propValue }),
          {}
        )
      );
    }
    return recursive(display) as IDisplay;
  }

  public componentDidUpdate(prevProps: {display: IDisplay}) {
    if ((prevProps.display !== this.props.display) && (JSON.stringify(this.props.display) !== JSON.stringify(prevProps.display))) {
      const sanitized = DisplayEditorHistoryUpdater.minimizeDisplay(this.props.display);
      const version = 'v0';
      pairs[version].pack(sanitized).then(packed => { console.log(packed); this.props.history.push(`/quickDisplay/${version}/${encodeURIComponent(packed)}`); });
    }
  }

  public render() {
    return (
      <DisplayEditor
        display={this.props.display}
      />
    );
  }
}

export default QuickDisplay;
