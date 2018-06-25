import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";

import StationsList from "src/ui/StationList";

const STATIONS_QUERY = gql`
	query {
		stations {
			name
		}
	}
`;

interface IStation {
	name: string,
};

interface IData {
	stations: IStation[],
};

// interface IVars {};
// {(loading: boolean, error: ApolloError, data: IData | undefined): React.ReactNode => {

class EmptyQuery extends Query<IData> {}
const StationsRetriever = () => (
	<EmptyQuery
		query={STATIONS_QUERY}
	>
		{(result: QueryResult<IData>): React.ReactNode => {
			if (result.loading) {
				return (<div>Loading</div>);
			}
			if (!result || !result.data) {
				return (<div>Wat</div>);
			}
			return (
				<StationsList stations={result.data.stations} />
			);
		}}
	</EmptyQuery>
);
export default StationsRetriever

// const stationsRetrieverQuery = graphql<Data, Variables>(STATIONS_QUERY, {
// })

// export default stationsRetrieverQuery(({ data: { loading, stations, error } }) => {
// 	if (error) return (<div>{'Error!'}</div>)
// 	if (loading) return (<div>{'Loading...'}</div>)
// 	return (<StationsList stations={stations} />)
// })

// class StationsRetrieverQuery extends Query<Data, Variables> {}

// const StationsRetriever = (props: StationsRetrieverProps) => (
// 	<StationsRetrieverQuery
// 		query={}
// 	/>
// 		{(loading: any, data: any) => {
// 			if (loading) return (<div>Loading...</div>)
// 			return <StationsList stations={data} />
// 		}}
// 	</StationsRetrieverQuery>
// );

// export default StationsRetrieverQuery(({data: { loading, }}))

// const StationsRetriever = (props: StationsRetrieverProps) => (
// 	<Query
// 		query={STATIONS_QUERY}
// 	>
// 		{(loading: any, data: any) => loading
// 			? <div>Loading...</div>
// 			: <StationsList stations={data} />
// 		}}
// 	</Query>
// )

// export default StationsRetriever
