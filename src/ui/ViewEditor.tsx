import React = require('react');

import { IViewBase, IStopTimesView } from 'src/ui/ConfigurationList';
import StopTimesViewEditor from 'src/ui/StopTimesViewEditor';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';
import { RIEInput } from '@attently/riek';
import { Mutation } from '@loona/react';
import gql from 'graphql-tag';

export interface IViewEditorProps {
  readonly view: IViewBase,
};

const setViewTitle = gql`
  mutation setViewTitle($viewId: ID!, $title: String!) {
    setViewTitle(viewId: $viewId, title: $title) @client
  }
`;

const ViewEditor: React.SFC<IViewEditorProps> = ({ view }: IViewEditorProps) => {
  const viewWrapper = (innerView: React.ReactNode) => (
    <>
      <ApolloClientsContext.Consumer>
        {({ virtualMonitor }) => (
          <div>
            {`Näkymän nimi: `}
            <Mutation
              mutation={setViewTitle}
              client={virtualMonitor}
            >
              {(setViewTitle) => (
                <RIEInput
                  change={({ viewElementTitle }: { viewElementTitle: string }) => {
                    setViewTitle({
                      variables: {
                        viewId: view.id,
                        title: viewElementTitle
                      }
                    });
                  }}
                  propName={'viewElementTitle'}
                  value={view.title ? view.title.fi : ''}
                />
              )}
            </Mutation>
            {`. `}
            {`Näkymän tyyppi:
            ${view.type}.`}
          </div>
        )}
      </ApolloClientsContext.Consumer>
      {innerView}
    </>
  );
  switch (view.type) {
    case 'stopTimes':
      return (viewWrapper(
        <StopTimesViewEditor
          view={view as IStopTimesView}
        />
      ))
    default:
      return (
        <div>
          {`Unknown view editor with title '${view.title}' of type ${view.type}`}
        </div>
      );
  }
};

export default ViewEditor;
