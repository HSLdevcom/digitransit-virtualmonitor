import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";
import { Link } from "react-router-dom";

import { IConfiguration, IDisplay } from "src/ui/ConfigurationList";
import LatLonEditor from "src/ui/LatLonEditor";
import { ApolloClientsContext } from "src/VirtualMonitorApolloClients";

interface IDisplayEditorProps {
  configuration: IConfiguration,
  display: IDisplay,
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

const DisplayEditor = ({configuration, display, t}: IDisplayEditorProps & InjectedTranslateProps) => (
  <div>
    <h2>
      <Link to={`/configuration/${configuration.name}/display/${display.name}`}>
        {`${t('display')}: `}
        {display.name || configuration.name}
      </Link>
    </h2>
    {display.position
      ? (<LatLonEditor
          {...display.position}
          editable={true}
        />)
      : null
    }
    <ul>
      {Object.values(display.viewCarousel[0].view.stops).map(s => (
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

export default translate('translations')(DisplayEditor);
