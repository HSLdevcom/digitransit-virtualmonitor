import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";
import { Link } from "react-router-dom";

import { IConfiguration, IDisplay, IView } from "src/ui/ConfigurationList";
import LatLonEditor from "src/ui/LatLonEditor";
import { ApolloClientsContext } from "src/VirtualMonitorApolloClients";

interface IViewEditorProps {
  configuration: IConfiguration,
  view: IView,
};

const ADD_STOP = gql`
  mutation AddStop {
    addStop @client
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

const ViewEditor = ({configuration, view, t}: IViewEditorProps & InjectedTranslateProps) => (
  <div>
    <h2>
      <Link to={`/configuration/${configuration.name}/view/${view.title}`}>
        {`${t('display')} :`}
        {view.title && (Object.values(view.title).length > 0)
          ? Object.values(view.title).filter(title => title)[0] || view.title
          : view.title
        }
      </Link>
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
          {addStop => (
            <button onClick={() => addStop()}>
              {t('prepareStop')}
            </button>
          )}
        </Mutation>)
      }
    </ApolloClientsContext.Consumer>
  </div>
);

export default translate('translations')(ViewEditor);
