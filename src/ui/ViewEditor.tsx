import { Mutation } from '@loona/react';
import gql from 'graphql-tag';
import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { IStopTimesView, IViewBase } from './ConfigurationList';
import StopTimesViewEditor from './StopTimesViewEditor';
import { ApolloClientsContext } from '../VirtualMonitorApolloClients';

export interface IViewEditorProps {
  readonly view: IViewBase;
}

const setViewTitleMutation = gql`
  mutation setViewTitle($viewId: ID!, $title: String!) {
    setViewTitle(viewId: $viewId, title: $title) @client
  }
`;

const setAmountOfRoutesShown = gql`
  mutation setAmountOfRoutesShown($viewId: ID!, $displayedRoutes: Int!) {
    setAmountOfRoutesShown(viewId: $viewId, displayedRoutes: $displayedRoutes)
      @client
  }
`;

const ViewEditor: React.SFC<IViewEditorProps> = ({
  t,
  view,
}: IViewEditorProps & WithTranslation) => {
  const viewWrapper = (innerView: React.ReactNode) => (
    <>
      <ApolloClientsContext.Consumer>
        {({ virtualMonitor }) => (
          <div>
            {`${t('viewEditorName')}: `}
            <Mutation mutation={setViewTitleMutation} client={virtualMonitor}>
              {setViewTitle => (
                <input
                  name="viewElementTitle"
                  onChange={e =>
                    setViewTitle({
                      variables: {
                        title: e.target.value,
                        viewId: view.id,
                      },
                    })
                  }
                />
              )}
            </Mutation>
            <Mutation mutation={setAmountOfRoutesShown} client={virtualMonitor}>
              {setAmountOfRoutesShown => (
                <>
                  <div>
                    <label htmlFor={'displayedRoutesInput'}>
                      {t('stopSearcherDisplayedResultCount')}:&nbsp;
                    </label>
                    <input
                      id={'displayedRoutesInput'}
                      type={'number'}
                      name={'searchPhrase'}
                      min="1"
                      defaultValue="7"
                      onChange={e =>
                        setAmountOfRoutesShown({
                          variables: {
                            displayedRoutes: e.target.value,
                            viewId: view.id,
                          },
                        })
                      }
                      max={999}
                      maxLength={3}
                      style={{ width: '3em' }}
                    />
                  </div>
                </>
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
      return viewWrapper(<StopTimesViewEditor view={view as IStopTimesView} />);
    default:
      return (
        <div>
          {`Unknown view editor with title '${view.title}' of type ${view.type}`}
        </div>
      );
  }
};

export default withTranslation('translations')(ViewEditor);
