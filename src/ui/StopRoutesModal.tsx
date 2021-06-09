import React, { FC, useState } from 'react';
import './StopRoutesModal.scss';
import './StopCode.scss';
import Icon from './Icon';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IStopInfo } from './StopInfoRetriever';
import { v4 as uuid } from 'uuid';
import Modal from 'react-modal';
Modal.setAppElement('#root');

interface Route {
  gtfsId: string;
  shortName: string;
}

interface Props {
  showModal: boolean;
  routes: Route[];
  stop: IStopInfo;
  closeModal: (route: Route[]) => void;
  hiddenRoutes?: Route[];
}

const StopRoutesModal: FC<Props & WithTranslation> = (
  props: Props & WithTranslation,
) => {
  const [hiddenRoutes, setHiddenRoutes] = useState(props.hiddenRoutes);
  const text = props.t('showHidden');
  const handleCheck = (e, route) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    if (e.target.name === 'all') {
      const routes = value ? props.routes : [];
      setHiddenRoutes(routes);
    } else if (value) {
      setHiddenRoutes([...hiddenRoutes, route]);
    } else if (hiddenRoutes.includes(route)) {
      setHiddenRoutes(
        hiddenRoutes.filter(r => {
          return r.shortName !== route.shortName;
        }),
      );
    }

    if (hiddenRoutes.length !== props.routes.length) {
      const input = document?.getElementById('all') as HTMLInputElement;
      if (input) {
        input.checked = false;
      }
    }
  };

  const handleClose = () => {
    props.closeModal?.(hiddenRoutes);
  };
  const isChecked = route => {
    if (!route) {
      return hiddenRoutes.length === props.routes.length;
    }
    return hiddenRoutes.includes(route);
  };
  return (
    <Modal
      isOpen={props.showModal}
      onRequestClose={handleClose}
      portalClassName="modal-stop-routes"
    >
      <div className="modal">
        <div className="close" onClick={handleClose} role="button">
          {' '}
          <Icon img="close" width={20} height={20} />
        </div>
        <span className="title"> {text} </span>
        <span className="stop">{props.stop.name}</span>
        <span className="stop-code">{props.stop.code}</span>
        <div className="row">
          {' '}
          <input
            id="all"
            type="checkbox"
            name="all"
            checked={isChecked(null)}
            onChange={e => handleCheck(e, null)}
          />{' '}
          {props.t('all')}
        </div>
        {props.routes.map(route => {
          return (
            <div key={uuid()} className="row">
              {' '}
              <input
                type="checkbox"
                name={route.shortName}
                checked={isChecked(route)}
                onChange={e => handleCheck(e, route)}
              />
              {route.shortName} - {route.gtfsId}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
export default withTranslation('translations')(StopRoutesModal);
