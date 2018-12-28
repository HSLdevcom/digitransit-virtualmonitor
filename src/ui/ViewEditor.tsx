import { RIEInput } from '@attently/riek';
import { Mutation } from '@loona/react';
import gql from 'graphql-tag';
import * as React from 'react';

import { IStopTimesView, IViewBase } from 'src/ui/ConfigurationList';
import StopTimesViewEditor from 'src/ui/StopTimesViewEditor';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';
import { translate, InjectedTranslateProps } from 'react-i18next';

export interface IViewEditorProps {
  readonly view: IViewBase,
};

const setViewTitleMutation = gql`
  mutation setViewTitle($viewId: ID!, $title: String!) {
    setViewTitle(viewId: $viewId, title: $title) @client
  }
`;

const ViewEditor: React.SFC<IViewEditorProps> = ({ t, view }: IViewEditorProps & InjectedTranslateProps) => {
  const viewWrapper = (innerView: React.ReactNode) => (
    <>
      <ApolloClientsContext.Consumer>
        {({ virtualMonitor }) => (
          <div>
            {`${t('viewEditorName')}: `}
            <Mutation
              mutation={setViewTitleMutation}
              client={virtualMonitor}
            >
              {(setViewTitle) => (
                <RIEInput
                  change={({ viewElementTitle }: { viewElementTitle: string }) => {
                    setViewTitle({
                      variables: {
                        title: viewElementTitle,
                        viewId: view.id,
                      }
                    });
                  }}
                  propName={'viewElementTitle'}
                  value={view.title ? view.title.fi : ''}
                />
              )}
            </Mutation>
            {`. `}
            {`${t('viewEditorType')}: 
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

export default translate('translations')(ViewEditor);
