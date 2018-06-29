import * as React from "react";
import { RouteComponentProps/* , withRouter */ } from 'react-router';
import { Link } from "react-router-dom";
import { isString } from "util";

import { IStopRenderFunc } from "src/ui/StopList";
import StopsByNameRetriever from "src/ui/StopsByNameRetriever";

type IProps = RouteComponentProps<{
  phrase?: string,
}>;

interface IState {
  displayedRoutes: number,
  searchPhrase: string,
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

  public render() { return(
    <div>
      <form
        onSubmit={this.stopSearchSubmit}
        action={'searchStop'}
        method={'GET'}
      >
        <div>Pysäkkietsin</div>
        <label htmlFor={'stopSearchInput'}>
          Hakusana:&nbsp;
        </label>
        <input
          id={'stopSearchInput'}
          type={'text'}
          name={'searchPhrase'}
          defaultValue={this.props.match.params.phrase || ''}
        />
        <label htmlFor={'displayedRoutesInput'}>
          Näytettävien reittien määrä:&nbsp;
        </label>
        <input
          id={'displayedRoutesInput'}
          type={'number'}
          name={'searchPhrase'}
          value={this.state.displayedRoutes}
          onChange={this.onDisplayedRoutesChange}
        />
        <button
          type={'submit'}
        >
          Etsi
        </button>
      </form>
      {this.state.searchPhrase
        ? (
          <div>
            <span>{`Searching for ${this.state.searchPhrase}`}</span>
            <StopsByNameRetriever
              phrase={this.state.searchPhrase}
              stopRenderer={this.stopRenderer}
            />
          </div>
        )
        : null
      }
    </div>
  )};
  
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
    this.setState({ searchPhrase: isString(data.get('searchPhrase')) ? (data.get('searchPhrase') as string) : '' });
  }

  private onDisplayedRoutesChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    this.setState({ displayedRoutes: parseFloat(event.currentTarget.value) });
  }
}

// const StopSelectorWithHistory = withRouter(StopSelector);

// export default StopSelectorWithHistory;
export default StopSelector;
