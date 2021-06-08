import React from 'react';
import './StopRoutesModal.scss';
import './StopCode.scss';
import Icon from './Icon';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IStopInfo } from './StopInfoRetriever';

interface Route {
  gtfsId: string;
  shortName: string;
}

interface Props {
  showModal: boolean;
  routes: Route[];
  stop: IStopInfo;
  closeModal: (route: Route) => void;
  hiddenRoutes?: Route[];
}

class StopRoutesModal extends React.Component<Props & WithTranslation, any> {
  constructor(props: Props & WithTranslation) {
    super(props);
    this.state = {
      hiddenRoutes: props.hiddenRoutes,
    };
  }

  handleCheck = (e, route) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    if (e.target.name === 'all') {
      this.setState({
        hiddenRoutes: value ? this.props.routes : [],
      });
    } else if (value) {
      this.setState(prevState => ({
        hiddenRoutes: [...prevState.hiddenRoutes, route],
      }));
    } else if (this.state.hiddenRoutes.includes(route)) {
      this.setState(prevState => ({
        hiddenRoutes: prevState.hiddenRoutes.filter(r => {
          return r.shortName !== route.shortName;
        }),
      }));
    }

    if (this.state.hiddenRoutes.length !== this.props.routes.length) {
      const input = document?.getElementById('all') as HTMLInputElement;
      if (input) {
        input.checked = false;
      }
    }
  };

  handleClose = () => {
    this.props.closeModal?.(this.state.hiddenRoutes);
  };
  isChecked = route => {
    if (!route) {
      return this.state.hiddenRoutes.length === this.props.routes.length;
    }
    return this.state.hiddenRoutes.includes(route);
  };
  render() {
    if (!this.props.showModal) {
      return null;
    }
    const text = this.props.t('showHidden');
    return (
      <div className="modal">
        <div className="close" onClick={this.handleClose} role="button">
          {' '}
          <Icon img="close" width={20} height={20} />
        </div>
        <span className="title"> {text} </span>
        <span className="stop">{this.props.stop.name}</span>
        <span className="stop-code">{this.props.stop.code}</span>
        <div className="row">
          {' '}
          <input
            id="all"
            type="checkbox"
            name="all"
            checked={this.isChecked(null)}
            onChange={e => this.handleCheck(e, null)}
          />{' '}
          {this.props.t('all')}
        </div>
        {this.props.routes.map(route => {
          return (
            <div className="row">
              {' '}
              <input
                type="checkbox"
                name={route.shortName}
                checked={this.isChecked(route)}
                onChange={e => this.handleCheck(e, route)}
              />
              {route.shortName} - {route.gtfsId}
            </div>
          );
        })}
      </div>
    );
  }
}
export default withTranslation('translations')(StopRoutesModal);
