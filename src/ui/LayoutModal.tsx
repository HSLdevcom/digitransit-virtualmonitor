import React, { ClassAttributes, FC, useState, useEffect } from 'react';
import cx from 'classnames';
import { horizontalLayouts, verticalLayouts } from './Layouts';
import isEqual from 'lodash/isEqual';
import Modal from 'react-modal';
import { withTranslation, WithTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { getColorByName } from '../util/getConfig';
import Icon from './Icon';

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

  useEffect(() => {
    if (selected) {
      const layoutBtn = document.getElementById(
        `layoutBtn-${selected.value}`,
      ) as HTMLInputElement;
      if (layoutBtn) {
        layoutBtn.focus();
      }
    }
  }, [selected]);

  const handleClose = () => {
    onClose(selected);
  };

  const handleSelect = option => {
    setSelected(option);
  };

  const verticalHeight = {
    content: {
      width: '640px',
    },
  };
  const layouts =
    orientation === 'horizontal' ? horizontalLayouts : verticalLayouts;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onClose(null)}
      portalClassName="modal"
      style={orientation === 'vertical' ? verticalHeight : undefined}
    >
      <div className="layout-modal-content-container">
        <section id="close">
          <button
            className="close-button"
            role="button"
            aria-label={t('close')}
            onClick={() => onClose(null)}
          >
            <Icon
              img="close"
              color={getColorByName('primary')}
              height={24}
              width={24}
            />
          </button>
        </section>
        <h2 className="layout-modal-header">{t('layoutModalHeader')}</h2>
        <div className="layouts">
          {layouts.map(l => {
            return (
              <div className="row" key={uuid()}>
                <h3 className="row-header">{t(l.label)}</h3>
                <div className="options">
                  {l.options.map(option => {
                    return (
                      <button
                        className={cx(
                          'option',
                          orientation === 'vertical' ? 'vertical' : '',
                          isEqual(option.value, selected.value)
                            ? 'label-selected'
                            : '',
                        )}
                        onClick={() => handleSelect(option)}
                        id={`layoutBtn-${option.value}`}
                        key={uuid()}
                        role="button"
                        aria-label={`${t(orientation)} ${t(l.label)} ${
                          option.rows
                        } ${t('rows')}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="button-container">
          <button className="close-button" onClick={handleClose}>
            {t('save')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default withTranslation('translations')(LayoutModal);
