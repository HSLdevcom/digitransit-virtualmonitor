import React, { ClassAttributes, FC, useState, useEffect } from 'react';
import cx from 'classnames';
import { horizontalLayouts, verticalLayouts } from './Layouts';
import isEqual from 'lodash/isEqual';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import LargeModal from './LargeModal';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

interface Option {
  value: string;
  label: ClassAttributes<HTMLDivElement>;
}
interface Props {
  option: Option;
  open: boolean;
  onSave: (option: number) => void;
  onClose: () => void;
  orientation: string;
  ariaHideApp?: boolean; // For unit testing
  allowInformationDisplay: boolean;
}

const LayoutModal: FC<Props> = ({
  orientation,
  option,
  onClose,
  onSave,
  open,
  ariaHideApp = true,
  allowInformationDisplay,
}) => {
  const [t] = useTranslation();

  const [selected, setSelected] = useState(option);

  useEffect(() => {
    if (!isEqual(selected, option)) {
      setSelected(option);
    }
    const layoutBtn = document.getElementById(
      `layoutBtn-${selected.value}`,
    ) as HTMLInputElement;
    if (layoutBtn) {
      layoutBtn.focus();
    }
  }, [option, open]);

  const layouts =
    orientation === 'horizontal' ? horizontalLayouts : verticalLayouts;
  return (
    <LargeModal
      isOpen={open}
      onRequestClose={() => onClose()}
      portalClassName="layout-modal modal"
      ariaHideApp={ariaHideApp}
      header={'layoutModalHeader'}
    >
      <div className="layout-modal-content-container">
        <div className="layouts">
          {layouts.map(l => {
            return (
              <div className="row" key={`layoutrow_${l.label}`}>
                <h3 className="row-header">{t(l.label)}</h3>
                <div className="row-info">{t(l.infoText)}</div>
                {l.label === 'information-display' &&
                  !allowInformationDisplay && (
                    <div className="info-display-warning">
                      {t('info-display-only-one')}
                    </div>
                  )}
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
                        disabled={
                          +option.value > 17 && !allowInformationDisplay
                        }
                        onClick={() => setSelected(option)}
                        id={`layoutBtn-${option.value}`}
                        key={`button_${option.value}`}
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
          <button
            className="close-button"
            onClick={() => onSave(+selected.value)}
          >
            {t('save')}
          </button>
        </div>
      </div>
    </LargeModal>
  );
};

export default LayoutModal;
