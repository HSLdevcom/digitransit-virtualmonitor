import React, { FC, useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
import { ConfigContext } from '../contexts';

interface IProps {
  handleOpenState: any;
  header: string;
}
const LargeModal: FC<IProps> = ({ handleOpenState, header, ...rest }) => {
  const [t] = useTranslation();
  const config = useContext(ConfigContext);

  return (
    <Modal
      isOpen={true}
      onRequestClose={() => handleOpenState(false)}
      portalClassName="modal"
    >
      <div className="monitor-modal-container">
        <section id="close">
          <button
            className="close-button"
            role="button"
            aria-label={t('close')}
            onClick={() => handleOpenState(false)}
          >
            <Icon
              img="close"
              color={config.colors.primary}
              height={24}
              width={24}
            />
          </button>
        </section>
        <h2 className="monitor-modal-header">{t(header)}</h2>
        {rest.children}
      </div>
    </Modal>
  );
};

export default LargeModal;
