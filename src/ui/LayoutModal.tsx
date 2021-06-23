import React, { ClassAttributes, FC, useState } from 'react';
import cx from 'classnames';
import { horizontalLayouts, verticalLayouts } from './Layouts';
import isEqual from 'lodash/isEqual';
import './LayoutModal.scss';
import Modal from 'react-modal';
import { withTranslation, WithTranslation } from 'react-i18next';
Modal.setAppElement('#root');

interface Option {
  value: string;
  label: ClassAttributes<HTMLDivElement>;
}
interface Props {
  option: Option;
  onClose: (option) => void;
  isOpen: boolean;
  orientation: string;
}

const LayoutModal: FC<Props & WithTranslation> = ({
  orientation,
  isOpen,
  option,
  onClose,
  t,
}) => {
  const [selected, setSelected] = useState(option);
  const handleClose = () => {
    onClose(selected);
  };
  const onClick = option => {
    setSelected(option);
  };
  const layouts =
    orientation === 'horizontal' ? horizontalLayouts : verticalLayouts;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onClose(selected)}
      portalClassName="modal"
    >
      <div className="layout-modal-content-container">
        <h2 className="layout-modal-header">{t('layoutModalHeader')}</h2>
        <div>
          {layouts.map(l => {
            return (
              <div className="row">
                <h3 className="row-header"> {l.label}</h3>
                <div className="options">
                  {l.options.map(option => {
                    return (
                      <div
                        className={cx(
                          'option',
                          isEqual(option.value, selected.value)
                            ? 'label-selected'
                            : '',
                        )}
                        onClick={() => onClick(option)}
                      >
                        {' '}
                        {option.label}{' '}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="button-container">
          <button className="close-button" onClick={handleClose}>
            {t('continue')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default withTranslation('translations')(LayoutModal);
