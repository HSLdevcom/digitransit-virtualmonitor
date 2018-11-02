import { RIEInput } from '@attently/riek';
import gql from 'graphql-tag';
import * as React from "react";
import { Mutation } from 'react-apollo';
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

const StopEditor: React.SFC<IStopEditorProps> = ({
  stop,
  stopInfo,
}) => (
  <div>
    <Link
      to={`/stop/${stop.gtfsId}`}
    >
      {stopInfo
        ? (<span>{stopInfo.name} (pysäkkinumero {stopInfo.code || ''})</span>)
        : (<span>{stop.gtfsId}</span>)
      }
    </Link>
    <ApolloClientsContext.Consumer>
      {({ virtualMonitor }) => (
        <Mutation
          mutation={SET_OVERRIDE_STOP_NAME}
          client={virtualMonitor}
        >
          {setOverrideStopName => (
            <>
              <label>Pysäkin nimi: </label>
              <RIEInput
                change={({ overrideStopName }: { overrideStopName: string }) => setOverrideStopName({ variables: { stopId: stop.id, overrideStopName } })}
                value={stop.overrideStopName}
                propName={'overrideStopName'}
              />
            </>
          )}
        </Mutation>
      )}
    </ApolloClientsContext.Consumer>
  </div>
);

export default StopEditor;
