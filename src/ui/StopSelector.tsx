import * as React from "react";
import { RouteComponentProps, withRouter } from 'react-router';
import { isString } from "util";
import StopsByNameRetriever from "./StopsByNameRetriever";

type IProps = RouteComponentProps<{}>;

interface IState {
  searchPhrase: string,
};

class StopSelector extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    this.state = { searchPhrase: '' };
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.state.searchPhrase !== prevState.searchPhrase) {
      this.props.history.push(`/searchStop?searchPhrase=${this.state.searchPhrase}`);
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
            <StopsByNameRetriever phrase={this.state.searchPhrase} />
          </div>
        )
        : null
      }
    </div>
  )};

  protected stopSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    this.setState({ searchPhrase: isString(data.get('searchPhrase')) ? (data.get('searchPhrase') as string) : '' });
  }
}

const StopSelectorWithHistory = withRouter(StopSelector);

export default StopSelectorWithHistory;
