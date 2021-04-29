import * as React from "react";
import { QueryResult } from 'react-apollo';
import { WithTranslation, withTranslation } from "react-i18next";
import { RouteComponentProps/* , withRouter */ } from 'react-router';
import { Link } from "react-router-dom";

import 'src/ui/StopSearch.css';

import { IStopRenderFunc } from "src/ui/StopList";
import StopsByNameRetriever, { IStopsByNameQuery, IStopsByNameResponse } from "src/ui/StopsByNameRetriever";

type IProps = RouteComponentProps<{
  readonly phrase?: string,
}> & WithTranslation;

interface IState {
  readonly displayedRoutes: number,
  readonly searchPhrase: string,
};

class StopSelector extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    this.state = {
      displayedRoutes: 7,
      searchPhrase: props.match.params.phrase ? props.match.params.phrase : '',
    };
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.state.searchPhrase !== prevState.searchPhrase) {
      this.props.history.push(`/searchStop/${this.state.searchPhrase}`);
    }
  }

  public render() {
    return(
      <div className={'stop-selector'}>
        <form
          onSubmit={this.stopSearchSubmit}
          action={'searchStop'}
          method={'GET'}
        >
          <div>{this.props.t('stopSearcher')}</div>
          <div>
            <label htmlFor={'stopSearchInput'}>
              {this.props.t('stopSearcherPhrase')}:&nbsp;
            </label>
            <input
              id={'stopSearchInput'}
              type={'text'}
              name={'searchPhrase'}
              defaultValue={this.props.match.params.phrase || ''}
            />
          </div>
          <div>
            <label htmlFor={'displayedRoutesInput'}>
            {this.props.t('stopSearcherDisplayedResultCount')}:&nbsp;
            </label>
            <input
              id={'displayedRoutesInput'}
              type={'number'}
              name={'searchPhrase'}
              value={this.state.displayedRoutes}
              onChange={this.onDisplayedRoutesChange}
              max={999}
              maxLength={3}
              style={{ width: '3em' }}
            />
          </div>
          <button
            type={'submit'}
          >
            {this.props.t('stopSearcherSearch')}
          </button>
        </form>
        {this.state.searchPhrase
          ? (
            <div>
              <span>{this.props.t('stopSearcherSearching', { searchPhrase: this.state.searchPhrase })}</span>
              <StopsByNameRetriever
                phrase={this.state.searchPhrase}
              >
                {(result: QueryResult<IStopsByNameResponse, IStopsByNameQuery>): React.ReactNode => {
                  if (result.loading) {
                    return (<div>{this.props.t('loading')}</div>);
                  }
                  if (!result || !result.data) {
                    return (<div>
                      {this.props.t('stopSearchError', { searchPhrase: this.state.searchPhrase })}
                    </div>);
                  }
                  if (!result.data.stops || result.data.stops.length === 0) {
                    return (<div>
                      {this.props.t('stopSearchNotFound', { searchPhrase: this.state.searchPhrase })}
                    </div>);
                  }
                  return (
                    <div>
                      <div>{this.props.t('stopSearchResult')}</div>
                      <div>
                        <ul>
                          {result.data.stops.map((stop) => (
                            <li key={stop.gtfsId}>
                              {this.stopRenderer(stop)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                }}
              </StopsByNameRetriever>
            </div>
          )
          : null
        }
      </div>
    );
  };

  protected stopRenderer: IStopRenderFunc = (stop) => (
    <Link
      to={`/stop/${stop.gtfsId}/${this.state.displayedRoutes}`}
    >
    {stop.name} - {stop.gtfsId}
    </Link>
  );

  protected stopSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    this.setState({ searchPhrase: typeof (data.get('searchPhrase')) === 'string' ? (data.get('searchPhrase') as string) : '' });
  }

  private onDisplayedRoutesChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    this.setState({ displayedRoutes: parseFloat(event.currentTarget.value) });
  }
}

export default withTranslation('translations')(StopSelector);
