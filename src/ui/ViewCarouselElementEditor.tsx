import { RIENumber } from "@attently/riek";
import gql from 'graphql-tag';
import React = require('react');

import { IViewCarouselElement, IStopTimesView } from 'src/ui/ConfigurationList';
import ViewEditor from 'src/ui/ViewEditor';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';
import { Mutation } from '@loona/react';

export interface ViewCarouselElementEditorProps {
  readonly viewCarouselElement: IViewCarouselElement,
};

const setViewCarouselElementDisplaySeconds = gql`
  mutation setViewCarouselElementDisplaySeconds($viewCarouselElementId: ID!, $displaySeconds: Float!) {
    setViewCarouselElementDisplaySeconds(viewCarouselElementId: $viewCarouselElementId, displaySeconds: $displaySeconds) @client
  }
`;

const ViewCarouselElementEditor: React.SFC<ViewCarouselElementEditorProps> = ({ viewCarouselElement }: ViewCarouselElementEditorProps) => (
  <>
    <div>
      Näytetty aika:&#32;
      <ApolloClientsContext.Consumer>
        {({ virtualMonitor }) => (
          <>
            <Mutation
              mutation={setViewCarouselElementDisplaySeconds}
              client={virtualMonitor}
            >
              {(setViewCarouselElementDisplaySeconds) =>
                (<>
                  <RIENumber
                    change={({ displaySeconds }: { displaySeconds: string}) => {
                      console.log(`Number changed!, ${displaySeconds}`)
                      setViewCarouselElementDisplaySeconds({
                        variables: {
                          viewCarouselElementId: viewCarouselElement.id,
                          displaySeconds: parseFloat(displaySeconds)
                        }
                      });
                      }
                    }
                    propName={'displaySeconds'}
                    validate={(newNumber: string) => (parseFloat(newNumber) >= 0)}
                    value={viewCarouselElement.displaySeconds}
                  />&nbsp;sekuntia
                  {viewCarouselElement.displaySeconds === 0
                    ? (<span><b>Näkymä pois käytöstä.</b></span>)
                    : null
                  }
                </>)
              }
            </Mutation>
          </>
        )}
      </ApolloClientsContext.Consumer>
    </div>
    <ViewEditor view={viewCarouselElement.view} />
  </>
);

export default ViewCarouselElementEditor;
