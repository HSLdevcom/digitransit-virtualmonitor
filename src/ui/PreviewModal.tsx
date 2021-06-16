import React, { ClassAttributes, FC, useState } from 'react';
import { getConfig } from '../util/getConfig';
import Modal from 'react-modal';
import Icon from './Icon';
import Monitor from './Monitor';

import './PreviewModal.scss';
Modal.setAppElement('#root');
interface IStop {
  code: string;
  desc: string;
  gtfsId: string;
  locationType: string;
  name: string;
  hiddenRoutes: Array<any>;
}
interface ISides {
  stops: Array<IStop>
}
interface IColumn {
  left: ISides;
  right: ISides;
}
interface IView {
  columns: IColumn;
  title: string;
  layout: number;
}
interface Props {
  view: Array<IView>;
  isOpen: boolean;
  onClose: (boolean) => void;
}
const PreviewModal: FC<Props> = (props: Props) => {
  const config = getConfig();
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={() => props.onClose(false)}
        portalClassName="preview"
      >
        <div
          role="button"
          className="close"
          onClick={() => props.onClose(false)}
        >
          <Icon img={'close'} height={12} width={12} color={'#007AC9'} />{' '}
        </div>
        <Monitor view={props.view} config={config} noPolling />
      </Modal>
    </>
  );
};

export default PreviewModal;
