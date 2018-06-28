import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";

import StopList from 'src/ui/StopList';

const STOPS_BY_NAME_QUERY = gql`
	query GetStop($phrase: String!) {
		stops(name: $phrase) {
      name,
      gtfsId,
		}
	}
`;

export interface IStop {
  name: string,
  gtfsId: string,
};

interface IStopsByNameResponse {
	stops: IStop[],
};

interface IStopsByNameQuery {
  phrase: string,
};

class StopsByNameQuery extends Query<IStopsByNameResponse, IStopsByNameQuery> {}

export interface IStopsByNameRetrieverProps {
  phrase: string,
};

const StopsByNameRetriever = ({ phrase }: IStopsByNameRetrieverProps) => (
  <StopsByNameQuery
    query={STOPS_BY_NAME_QUERY}
    variables={{ phrase }}
  >
    {(result: QueryResult<IStopsByNameResponse, IStopsByNameQuery>): React.ReactNode => {
      if (result.loading) {
        return (<div>Ladataan…</div>);
      }
      if (!result || !result.data) {
        return (<div>
          {`Virhe haettaessa pysäkkiä stringillä ${phrase}.`}
        </div>);
      }
      if (!result.data.stops || result.data.stops.length === 0) {
        return (<div>
          {`Haettua pysäkkiä stringillä ${phrase} ei löytynyt.`}
        </div>);
      }
      return (
				<StopList
          stops={result.data.stops}
        />
      );
    }}
  </StopsByNameQuery>
);

export default StopsByNameRetriever;
