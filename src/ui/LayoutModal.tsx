import React, { ClassAttributes, FC, useState, useEffect, useRef } from 'react';
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

  const selectedBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isEqual(selected, option)) {
      setSelected(option);
    }
  }, [option, open]);

  const layouts: typeof horizontalLayouts | typeof verticalLayouts =
    orientation === 'horizontal' ? horizontalLayouts : verticalLayouts;
  return (
    <LargeModal
      isOpen={open}
      onRequestClose={() => onClose()}
      portalClassName="layout-modal modal"
      ariaHideApp={ariaHideApp}
      header={'layoutModalHeader'}
      onAfterOpen={() => selectedBtnRef.current?.focus()}
    >
      <div className="layout-modal-content-container">
        <div className="layouts">
          {layouts.map(l => {
            return (
              <div className="row" key={`layoutrow_${l.label}`}>
                {l.label && (
                  <h3 id={`row-header-${l.label}`} className="row-header">
                    {t(l.label)}
                  </h3>
                )}
                {l.infoText && <div className="row-info">{t(l.infoText)}</div>}
                {l.label === 'information-display' &&
                  !allowInformationDisplay && (
                    <div className="info-display-warning">
                      {t('info-display-only-one')}
                    </div>
                  )}
                <div
                  className="options"
                  role="group"
                  aria-labelledby={
                    l.label ? `row-header-${l.label}` : undefined
                  }
                >
                  {l.options.map(option => {
                    const isUnavailable =
                      +option.value > 17 &&
                      +option.value < 20 &&
                      !allowInformationDisplay;
                    return (
                      <button
                        ref={el => {
                          if (isEqual(option.value, selected.value)) {
                            selectedBtnRef.current = el;
                          }
                        }}
                        className={cx(
                          'option',
                          orientation === 'vertical' ? 'vertical' : '',
                          isEqual(option.value, selected.value)
                            ? 'label-selected'
                            : '',
                        )}
                        aria-disabled={isUnavailable || undefined}
                        onClick={() => {
                          if (isUnavailable) return;
                          setSelected(option);
                        }}
                        id={`layoutBtn-${option.value}`}
                        key={`button_${option.value}`}
                        aria-label={[
                          t(orientation as 'horizontal' | 'vertical'),
                          l.label ? t(l.label) : null,
                          option.rows ? `${option.rows} ${t('rows')}` : null,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-pressed={isEqual(option.value, selected.value)}
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
            className="save-button"
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
