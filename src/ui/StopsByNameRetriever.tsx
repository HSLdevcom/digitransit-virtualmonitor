import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import { InjectedTranslateProps, translate } from "react-i18next";

import StopList, { IStopRenderFunc } from 'src/ui/StopList';

export const STOPS_BY_NAME_QUERY = gql`
	query GetStop($phrase: String!) {
		stops(name: $phrase) {
      name,
      gtfsId,
		}
	}
`;

export interface IStop {
  readonly name: string,
  readonly gtfsId: string,
};

export interface IStopsByNameResponse {
	readonly stops: ReadonlyArray<IStop>,
};

export interface IStopsByNameQuery {
  readonly phrase: string,
};

class StopsByNameQuery extends Query<IStopsByNameResponse, IStopsByNameQuery> {}

export interface IStopsByNameRetrieverProps {
  readonly phrase: string,
  readonly stopRenderer?: IStopRenderFunc,
};

const StopsByNameRetriever = ({ phrase, stopRenderer, t }: IStopsByNameRetrieverProps & InjectedTranslateProps) => (
  <StopsByNameQuery
    query={STOPS_BY_NAME_QUERY}
    variables={{ phrase }}
  >
    {(result: QueryResult<IStopsByNameResponse, IStopsByNameQuery>): React.ReactNode => {
      if (result.loading) {
        return (<div>{t('loading')}</div>);
      }
      if (!result || !result.data) {
        return (<div>
          {t('stopSearchError', { searchPhrase: phrase })}
        </div>);
      }
      if (!result.data.stops || result.data.stops.length === 0) {
        return (<div>
          {t('stopSearchNotFound', { searchPhrase: phrase })}
        </div>);
      }
      return (
				<StopList
          stops={result.data.stops}
          stopRenderer={stopRenderer}
        />
      );
    }}
  </StopsByNameQuery>
);

export default translate('translations')(StopsByNameRetriever);
