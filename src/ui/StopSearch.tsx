import * as React from "react";
import { QueryResult } from 'react-apollo';
import { WithTranslation, withTranslation } from "react-i18next";

import StopsByNameRetriever, { IStopsByNameQuery, IStopsByNameResponse, IStopWithName } from "./StopsByNameRetriever";
import './StopSearch.css';

type IProps = {
  readonly children?: (stops: ReadonlyArray<IStopWithName>) => React.ReactNode,
  readonly phrase?: string,
  readonly showTitle?: boolean,
} & WithTranslation;

interface IState {
  readonly searchPhrase: string,
};

class StopSearch extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    this.state = {
      searchPhrase: props.phrase || '',
    };
  }

  static get defaultProps() {
    return {
      showTitle: false,
    };
  }

  public render() { return(
    <div id="stop-search" className={'stop-selector'}>
      <form
        onSubmit={this.stopSearchSubmit}
        action={'searchStop'}
        method={'GET'}
      >
        {this.props.showTitle
          ? <h3>{this.props.t('stopSearcher')}</h3>
          : null
        }
        <label htmlFor={'stopSearchInput'}>
          {this.props.t('stopSearcherPhrase')}:&nbsp;
        </label>
        <input
          id={'stopSearchInput'}
          type={'text'}
          name={'searchPhrase'}
          defaultValue={this.props.phrase || ''}
        />
        &nbsp;
        <button
          type={'submit'}
        >
          {this.props.t('stopSearcherSearch')}
        </button>
      </form>
      {this.state.searchPhrase
        ? (
          <>
            <div>
              <span>{this.props.t('stopSearchResult', { searchPhrase: this.state.searchPhrase })}:</span>
              <StopsByNameRetriever
                phrase={this.state.searchPhrase}
              >
                {(result: QueryResult<IStopsByNameResponse, IStopsByNameQuery>): React.ReactNode => {
                  if (result.loading) {
                    return (<div>{this.props.t('loading')}</div>);
                  }
                  if (!result || !result.data) {
                    return (
                      <ul>
                        <li>
                          {this.props.t('stopSearchError', { searchPhrase: this.state.searchPhrase })}
                        </li>
                      </ul>
                    );
                  }
                  if (!result.data.stops || result.data.stops.length === 0) {
                    return (
                      <ul>
                        <li>
                          {this.props.t('stopSearchNotFound', { searchPhrase: this.state.searchPhrase })}
                        </li>
                      </ul>
                    );
                  }
                  return (this.props.children
                    ? this.props.children(result.data.stops)
                    : (
                      <ul>
                        {result.data.stops.map((stop) => (
                          <li key={stop.gtfsId}>
                            {stop.name} - {stop.gtfsId}
                          </li>
                        ))}
                      </ul>
                    )
                  );
                }}
              </StopsByNameRetriever>
            </div>
          </>
        )
        : null
      }
    </div>
  )};

  protected stopSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    this.setState({ searchPhrase: typeof (data.get('searchPhrase')) === 'string' ? (data.get('searchPhrase') as string) : '' });
  }
}

export default withTranslation('translations')(StopSearch);
