import React, { ClassAttributes, FC, useState } from 'react';
import cx from 'classnames';
import Icon from './Icon';
import isEqual from 'lodash/isEqual';
import './LayoutModal.scss';
import Modal from 'react-modal';
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

const LayoutModal: FC<Props> = (props: Props) => {
  const [selected, setSelected] = useState(props.option);
  const handleClose = () => {
    props.onClose(selected);
  };
  const onClick = option => {
    setSelected(option);
  };
  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={() => props.onClose(selected)}
      portalClassName="modal"
    >
      <div>
        {layouts.map(l => {
          return (
            <div className="row">
              <span className="header"> {l.label}</span>
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
        <button className="close-button" onClick={handleClose}>
          {' '}
          Sulje{' '}
        </button>
      </div>
    </Modal>
  );
};

export default LayoutModal;
