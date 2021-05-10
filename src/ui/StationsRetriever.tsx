import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import { WithTranslation, withTranslation } from "react-i18next";

import StationsList from "./StationList";

const STATIONS_QUERY = gql`
	query {
		stations {
			name
		}
	}
`;

interface IStation {
	readonly name: string,
};

interface IData {
	readonly stations: ReadonlyArray<IStation>,
};

class EmptyQuery extends Query<IData> {}
const StationsRetriever = (props: WithTranslation) => (
	<EmptyQuery
		query={STATIONS_QUERY}
	>
		{(result: QueryResult<IData>): React.ReactNode => {
			if (result.loading) {
				return (<div>{props.t('loading')}</div>);
			}
			if (!result || !result.data) {
				return (<div>{props.t('stopRetrieveError', { stopId: '' })}</div>);
				// return (<div>{props.t('stopRetrieveError', { stopId: props.stop })}</div>);
			}
			return (
				<StationsList stations={result.data.stations} />
			);
		}}
	</EmptyQuery>
);
export default withTranslation('translations')(StationsRetriever)

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
