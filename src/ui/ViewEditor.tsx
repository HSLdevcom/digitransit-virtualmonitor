import { Mutation } from '@loona/react';
import gql from 'graphql-tag';
import * as React from 'react';
import { WithTranslation, withTranslation } from "react-i18next";

import { IStopTimesView, IViewBase } from 'src/ui/ConfigurationList';
import StopTimesViewEditor from 'src/ui/StopTimesViewEditor';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';

export interface IViewEditorProps {
  readonly view: IViewBase,
};

const setViewTitleMutation = gql`
  mutation setViewTitle($viewId: ID!, $title: String!) {
    setViewTitle(viewId: $viewId, title: $title) @client
  }
`;

const ViewEditor: React.SFC<IViewEditorProps> = ({ t, view }: IViewEditorProps & WithTranslation) => {
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
                <input name="viewElementTitle" onChange={e =>
                  setViewTitle({
                    variables: {
                      title: e.target.value,
                      viewId: view.id,
                    }
                  })
                }
                />
              )}
            </Mutation>
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

export default withTranslation('translations')(ViewEditor);
