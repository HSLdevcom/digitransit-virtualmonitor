import { Mutation } from '@loona/react';
import gql from 'graphql-tag';
import * as React from 'react';
import { WithTranslation, withTranslation } from "react-i18next";

import { IViewCarouselElement } from 'src/ui/ConfigurationList';
import ViewEditor from 'src/ui/ViewEditor';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';

export interface IViewCarouselElementEditorProps {
  readonly viewCarouselElement: IViewCarouselElement,
};

const setViewCarouselElementDisplaySecondsMutation = gql`
  mutation setViewCarouselElementDisplaySeconds($viewCarouselElementId: ID!, $displaySeconds: Float!) {
    setViewCarouselElementDisplaySeconds(viewCarouselElementId: $viewCarouselElementId, displaySeconds: $displaySeconds) @client
  }
`;

const removeViewCarouselElementMutation = gql`
  mutation removeViewCarouselElement($diplayId: ID!, $viewCarouselElementId: ID!) {
    removeViewCarouselElement(viewCarouselElementId: $viewCarouselElementId, displaySeconds: $displaySeconds) @client
  }
`;

const ViewCarouselElementEditor: React.SFC<IViewCarouselElementEditorProps & WithTranslation> = ({ t, viewCarouselElement }) => (
  <>
    <div>
      {t('viewCarouselElementEditorShownTime')}:&#32;
      <ApolloClientsContext.Consumer>
        {({ virtualMonitor }) => (
          <>
            <Mutation
              mutation={setViewCarouselElementDisplaySecondsMutation}
              client={virtualMonitor}
            >
              {(setViewCarouselElementDisplaySeconds) =>
                (<>
                  <input id="number" type="number" min="3" defaultValue="3" onChange={e => setViewCarouselElementDisplaySeconds({
                        variables: {
                          displaySeconds: e.target.value,
                          viewCarouselElementId: viewCarouselElement.id,
                        }
                      })} />
                  &nbsp;{t('seconds')}.
                  {viewCarouselElement.displaySeconds === 0
                    ? (<span><b>{t('viewCarouselElementEditorViewDisabled')}</b></span>)
                    : null
                  }
                </>)
              }
            </Mutation>
            <Mutation
              mutation={removeViewCarouselElementMutation}
              client={virtualMonitor}
            >
              {(removeViewCarouselElement) =>
                (<button
                  onClick={() => removeViewCarouselElement({ variables: {
                    displayId: 'aaaaaa',
                    viewCarouselElementId: viewCarouselElement.id,
                  }})}
                >
                  {t('viewCarouselElementEditorDeleteView')}
                </button>)
              }
            </Mutation>
          </>
        )}
      </ApolloClientsContext.Consumer>
    </div>
    <ViewEditor view={viewCarouselElement.view} />
  </>
);

export default withTranslation('translations')(ViewCarouselElementEditor);
