import { Query } from '@loona/react';
import gql from 'graphql-tag';
import { History } from 'history';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import { virtualMonitorClient } from 'src/graphQL/virtualMonitorClient';
import { IConfiguration, IDisplay } from 'src/ui/ConfigurationList';
import { ConfigurationFieldsFragment, DisplayFieldsFragment } from 'src/ui/ConfigurationRetriever';
import DisplayEditor from 'src/ui/DisplayEditor';
import { pairs } from 'src/ui/DisplayUrlCompression';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';

const addQuickConfiguration = gql`
  ${ConfigurationFieldsFragment}

  mutation addQuickConfiguration {
    addQuickConfiguration @client {
      ...configurationFields
    }
  }
`;

const addQuickDisplay = gql`
  ${DisplayFieldsFragment}

  mutation addQuickDisplay($display: SDisplayInput!) {
    addQuickDisplay(display: $display) @client {
      ...displayFields
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
  unpackedDisplayUrl?: IDisplay,
};
class DisplayQuery extends Query<{ display: IDisplay }, { id: string }> {}

class QuickDisplay extends React.Component<IQuickDisplayProps & { virtualMonitor: typeof virtualMonitorClient }, IQuickDisplayState> {
  constructor(props: IQuickDisplayProps & { virtualMonitor: typeof virtualMonitorClient }) {
    super(props);
    this.state = {};
    if (props.match.params.version && props.match.params.packedDisplay) {
      pairs[props.match.params.version].unpack(decodeURIComponent(props.match.params.packedDisplay)).then((unpacked: IDisplay) => {
        this.insertDisplayToCache(props.virtualMonitor, unpacked);
        this.setState({
          unpackedDisplayUrl: unpacked,
        });
      });
    } else {
      props.virtualMonitor.mutate({
        mutation: addQuickConfiguration,
      }).then(({ data, errors }: { data?: { addQuickConfiguration: IConfiguration }, errors?: any }) => {
        if (errors) {
          throw new Error(errors);
        }
        if (data && (data.addQuickConfiguration.displays).length > 0) {
          this.setState({
            displayId: data.addQuickConfiguration.displays[0].id,
          });
        } else {
          this.setState({
            displayId: undefined,
          });
        }
      })
    }
  }

  public render() {
    return (
      <ApolloClientsContext.Consumer>
        {({ virtualMonitor }) =>
          (<>
            {/* {this.state.unpackedDisplayUrl
              ? (
                <>
                  <span>unpackedDisplayUrl</span>
                  <textarea
                    readOnly
                    value={JSON.stringify(this.state.unpackedDisplayUrl)}
                  />
                </>
              )
              : null
            } */}
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

  protected insertDisplayToCache(virtualMonitor: typeof virtualMonitorClient, display: IDisplay) {
    const insertable: any = {
      ...display,
      __typename: 'Display',
      id: uuidv4(),
      viewCarousel: Array.from(display.viewCarousel).map(vce => ({
        ...vce,
        __typename: 'SViewWithDisplaySeconds',
        id: uuidv4(),
        view: {
          ...vce.view,
          __typename: 'StopTimesView',
          id: uuidv4(),
          stops: Array.from(vce.view.stops).map(stop => ({
            ...stop,
            __typename: 'Stop',
            id: uuidv4(),
          })),
          title: {
            ...vce.view.title,
            __typename: 'TranslatedString',
          },
        }
      }))
    };

    virtualMonitor.mutate({
      mutation: addQuickDisplay,
      variables: {
        display: insertable,
      },
    }).then(
      (
        ({ data, errors }: { data?: { addQuickDisplay: IDisplay }, errors?: any }) => {
          if (data && data.addQuickDisplay) {
            this.setState({
              displayId: data.addQuickDisplay.id,
            });
          } else {
            this.setState({
              displayId: undefined,
            });
          }
        }
      ).bind(this)
    );
  }
}

interface IDisplayEditorHistoryUpdaterProps {
  display: IDisplay,
  history: History,
};

class DisplayEditorHistoryUpdater extends React.PureComponent<IDisplayEditorHistoryUpdaterProps> {
  // Removes IDs and __typenames from the display. Preserve nulls.
  public static minimizeDisplay(display: IDisplay): IDisplay {
    const removeIDAndTypename = (o: { id?: string, __typename?: string }): {  } => {
      const { id, __typename, ...rest } = { ...o, id: undefined, __typename: undefined };
      return rest;
    }
    const recursive = (o: {}): {} => {
      return (
        Object.getOwnPropertyNames(removeIDAndTypename(o))
          .filter(propName => (o[propName] !== undefined) && (o[propName] !== null))
          .map(propName => {
            const prop = o[propName];
            let minimizedPropType;
            if ((Array.isArray(prop)) || (prop === null)) {
              minimizedPropType = prop;
            } else if (typeof prop === 'object') {
              minimizedPropType = recursive(prop)
            } else {
              minimizedPropType = prop;
            }
            return [
              propName,
              minimizedPropType,
            ];
          })
          .reduce(
            (acc: {}, [propName, propValue]) => ({ ...acc, [propName]:propValue }),
            {}
          )
      );
    }
    return recursive(display) as IDisplay;
  }

  constructor(props: IDisplayEditorHistoryUpdaterProps) {
    super(props);
  }

  public componentDidUpdate(prevProps: {display: IDisplay}) {
    if (this.props.display && (prevProps.display !== this.props.display) && (JSON.stringify(this.props.display) !== JSON.stringify(prevProps.display))) {
      const sanitized = DisplayEditorHistoryUpdater.minimizeDisplay(this.props.display);
      const version = 'v0';
      pairs[version].pack(sanitized).then(packed => this.props.history.push(`/quickDisplay/${version}/${encodeURIComponent(packed)}`));
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

export default (props: IQuickDisplayProps) => (
  <ApolloClientsContext.Consumer>
    {({ virtualMonitor }) =>
      <QuickDisplay
        virtualMonitor={virtualMonitor}
        {...props}
      />
    }
  </ApolloClientsContext.Consumer>
);
