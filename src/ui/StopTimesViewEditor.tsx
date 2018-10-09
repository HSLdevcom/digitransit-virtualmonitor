import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";
import { Link } from "react-router-dom";

import { IConfiguration, IStopTimesView, IStop } from "src/ui/ConfigurationList";
import { ApolloClientsContext } from "src/VirtualMonitorApolloClients";

interface IViewEditorProps {
  readonly configuration?: IConfiguration,
  readonly view: IStopTimesView,
};

const ADD_STOP = gql`
  mutation AddStop($stop: Stop!) {
    addStop(stop: $stop) @client
  }
`;

// {
//   Mutation: {
//     addStop: (_: any, { configuration, display }: { configuration: string, display: string }, { cache, getCacheKey }: any) => {
//       cache.writeData();
//     },
//   },
// };

// const wrapper: MouseEvent<HTMLButtonElement> = () => {

// };

const StopTimesViewEditor = ({configuration, view, t}: IViewEditorProps & InjectedTranslateProps) => (
  <div>
    <h2>
      {configuration
        ? (<Link to={`/configuration/${configuration.name}/view/${view.title}`}>
          {`${t('display')} :`}
          {view.title && (Object.values(view.title).length > 0)
            ? Object.values(view.title).filter(title => title)[0] || view.title
            : view.title
          }
        </Link>)
        : `${view.title ? view.title.fi : 'Tuntematon näkymä.'}`
      }
    </h2>
    <ul>
      {Object.values(view.stops).map(s => (
        <div key={s.gtfsId}>
          <Link
            to={`/stop/${s.gtfsId}`}
          >
            Stop {s.gtfsId}
          </Link>
        </div>
      ))}
    </ul>
    <ApolloClientsContext.Consumer>
      {({ virtualMonitor }) =>
        (<Mutation
          mutation={ADD_STOP}
          client={virtualMonitor}
        >
            {(addStop) => (
              <button onClick={() =>
                addStop({
                  variables: {
                    stop: {
                      gtfsId: 'HSL:4700212',
                      __typename: 'Stop',
                    },
                  },
                })
              }>
              {t('prepareStop')}
            </button>
          )}
        </Mutation>)
      }
    </ApolloClientsContext.Consumer>
  </div>
);

export default translate('translations')(StopTimesViewEditor);
