import React, { FC, useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
import { ConfigContext } from '../contexts';

interface IProps {
  onRequestClose: () => void;
  header: 'import-monitor' | 'layoutModalHeader';
  isOpen?: boolean;
  portalClassName?: string;
  ariaHideApp?: boolean;
}
const LargeModal: FC<IProps> = ({
  onRequestClose,
  header,
  isOpen,
  portalClassName,
  ariaHideApp,
  ...rest
}) => {
  const [t] = useTranslation();
  const config = useContext(ConfigContext);

  return (
    <Modal
      isOpen={isOpen ?? true}
      onRequestClose={() => onRequestClose()}
      portalClassName={portalClassName}
      ariaHideApp={ariaHideApp}
      aria={{ labelledby: 'large-modal-heading' }}
    >
      <div className="monitor-modal-container">
        <div id="close">
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
        <h2 id="large-modal-heading" className="monitor-modal-header">
          {t(header)}
        </h2>
        {rest.children}
      </div>
    </Modal>
  );
};

export default LargeModal;
