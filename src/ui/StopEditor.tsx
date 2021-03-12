import gql from 'graphql-tag';
import * as React from "react";
import { Mutation } from 'react-apollo';
import { WithTranslation, withTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

import { IStop } from 'src/ui/ConfigurationList';
import { IStopInfo } from 'src/ui/StopInfoRetriever';
import { ApolloClientsContext } from 'src/VirtualMonitorApolloClients';

interface IStopEditorProps {
  stop: IStop,
  stopInfo?: IStopInfo,
}

const SET_OVERRIDE_STOP_NAME = gql`
  mutation setOverrideStopName($stopId: ID!, $overrideStopName: String) {
    setOverrideStopName(stopId: $stopId, overrideStopName: $overrideStopName) @client
  }
`;

const StopEditor: React.SFC<IStopEditorProps & WithTranslation> = ({
  stop,
  stopInfo,
  t,
}) => (
  <div>
    <span>
      {stopInfo
        ? (<span>{stopInfo.name} ({t('stopCode')} {stopInfo.code || ''})</span>)
        : (<span>{stop.gtfsId}</span>)
      }
    </span>
    <ApolloClientsContext.Consumer>
      {({ virtualMonitor }) => (
        <Mutation
          mutation={SET_OVERRIDE_STOP_NAME}
          client={virtualMonitor}
        >
          {(setOverrideStopName: (arg0: { variables: { stopId: string | undefined; overrideStopName: string; }; }) => any) => (
            <>
              <label
                style={{ marginLeft: '0.5em', }}
              >
                {`${t('stopName')}: `}
              </label>
              <input onChange={e => setOverrideStopName({ variables: { stopId: stop.id, overrideStopName: e.target.value } })} />
            </>
          )}
        </Mutation>
      )}
    </ApolloClientsContext.Consumer>
  </div>
);

export default withTranslation('translations')(StopEditor);
