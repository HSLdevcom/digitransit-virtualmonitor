import React, { FC, ReactNode, useContext, useRef } from 'react';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash/uniqueId';
import Icon from './Icon';
import { ConfigContext } from '../contexts';

interface IProps {
  onRequestClose: () => void;
  header: 'import-monitor' | 'layoutModalHeader';
  isOpen?: boolean;
  portalClassName?: string;
  ariaHideApp?: boolean;
  onAfterOpen?: () => void;
  children?: ReactNode;
}
const LargeModal: FC<IProps> = ({
  onRequestClose,
  header,
  isOpen,
  portalClassName,
  ariaHideApp,
  onAfterOpen,
  ...rest
}) => {
  const [t] = useTranslation();
  const config = useContext(ConfigContext);
  const headingIdRef = useRef<string | null>(null);
  if (headingIdRef.current === null) {
    headingIdRef.current = uniqueId('modal-heading-');
  }
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <Modal
      isOpen={isOpen ?? true}
      onRequestClose={() => onRequestClose()}
      portalClassName={portalClassName}
      ariaHideApp={ariaHideApp}
      aria={{ labelledby: headingIdRef.current }}
      onAfterOpen={() => {
        onAfterOpen ? onAfterOpen() : headingRef.current?.focus();
      }}
    >
      <div className="monitor-modal-container">
        <div className="modal-close-container">
          <button
            className="close-button"
            aria-label={t('close')}
            onClick={() => onRequestClose()}
          >
            <Icon
              img="close"
              color={config.colors.primary}
              height={24}
              width={24}
            />
          </button>
        </div>
        <h2
          ref={headingRef}
          id={headingIdRef.current}
          className="monitor-modal-header"
          tabIndex={-1}
        >
          {t(header)}
        </h2>
        {rest.children}
      </div>
    </Modal>
  );
};

export default LargeModal;
