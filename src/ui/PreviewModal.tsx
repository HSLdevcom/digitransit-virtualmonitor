import React, { FC } from 'react';
import Modal from 'react-modal';
import { IHiddenRoute } from '../util/Interfaces';
import CarouselContainer from './CarouselContainer';
import Icon from './Icon';
import cx from 'classnames';

import './PreviewModal.scss';
Modal.setAppElement('#root');
interface IStop {
  code: string;
  desc: string;
  gtfsId: string;
  locationType: string;
  name: string;
  hiddenRoutes: Array<IHiddenRoute>;
}
interface ISides {
  stops: Array<IStop>;
  title: string;
}
interface IColumn {
  left: ISides;
  right: ISides;
}
interface ICard {
  title: string;
  layout: number;
  duration: number;
  columns: IColumn;
}
interface IView {
  cards: Array<ICard>;
}
interface Props {
  view: IView;
  isOpen: boolean;
  onClose: (boolean) => void;
  isLandscape: boolean;
}
const PreviewModal: FC<Props> = (props: Props) => {
  const currentMillis = new Date().getTime();
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={() => props.onClose(false)}
        portalClassName={cx('preview', !props.isLandscape ? 'portrait' : '')}
      >
        <div className="title-and-close">
          <div className="title">Esikatselu</div>
          <div
            role="button"
            className="close"
            onClick={() => props.onClose(false)}
          >
            <Icon img={'close'} height={15} width={15} color={'#FFFFFF'} />{' '}
          </div>
        </div>
        <div className="carouselContainer">
          <CarouselContainer
            views={props.view.cards}
            noPolling
            time={currentMillis}
            isPreview
            isLandscape={props.isLandscape}
          />
        </div>
      </Modal>
    </>
  );
};

export default PreviewModal;
