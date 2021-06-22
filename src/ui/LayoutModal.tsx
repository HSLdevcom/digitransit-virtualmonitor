import React, { ClassAttributes, FC, useState } from 'react';
import cx from 'classnames';
import Icon from './Icon';
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
}

const layouts = [
  {
    label: 'Yksijakoinen',
    options: [
      {
        value: '1',
        label: (
          <>
            <Icon img="layout1" height={90} width={160} />
            <span className="label-text">4</span>
          </>
        ),
      },
      {
        value: '2',
        label: (
          <>
            <Icon img="layout2" height={90} width={160} />
            <span className="label-text">8</span>
          </>
        ),
      },
      {
        value: '3',
        label: (
          <>
            <Icon img="layout3" height={90} width={160} />
            <span className="label-text">12</span>
          </>
        ),
      },
    ],
  },
  {
    label: 'Kaksijakoinen',
    options: [
      {
        value: '4',
        label: (
          <>
            <Icon img="layout4" height={90} width={160} />
            <span className="label-text">4+4</span>
          </>
        ),
      },
      {
        value: '5',
        label: (
          <>
            <Icon img="layout5" height={90} width={160} />
            <span className="label-text">8+8</span>
          </>
        ),
      },
      {
        value: '6',
        label: (
          <>
            <Icon img="layout6" height={90} width={160} />
            <span className="label-text">12+12</span>
          </>
        ),
      },
    ],
  },
  {
    label: 'Kaksijakoinen yhdistelmä',
    options: [
      {
        value: '7',
        label: (
          <>
            <Icon img="layout7" height={90} width={160} />
            <span className="label-text">4+8</span>
          </>
        ),
      },
      {
        value: '8',
        label: (
          <>
            <Icon img="layout8" height={90} width={160} />
            <span className="label-text">8+12</span>
          </>
        ),
      },
    ],
  },
  {
    label: 'Itään / länteen',
    options: [
      {
        value: '9',
        label: (
          <>
            <Icon img="layout9" height={90} width={160} />
            <span className="label-text">4+4</span>
          </>
        ),
      },
      {
        value: '10',
        label: (
          <>
            <Icon img="layout10" height={90} width={160} />
            <span className="label-text">8+8</span>
          </>
        ),
      },
      {
        value: '11',
        label: (
          <>
            <Icon img="layout11" height={90} width={160} />
            <span className="label-text">12+12</span>
          </>
        ),
      },
    ],
  },
];

const LayoutModal: FC<Props & WithTranslation> = ({isOpen, option, onClose, t}) => {
  const [selected, setSelected] = useState(option);
  const handleClose = () => {
    onClose(selected);
  };
  const onClick = option => {
    setSelected(option);
  };
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
                        'label',
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
      <div className="button-container" >
      <button className="close-button" onClick={handleClose}>
        {' '}
        Sulje{' '}
      </button>
      </div>
      </div>
    </Modal>
  );
};

export default withTranslation('translations')(LayoutModal);
