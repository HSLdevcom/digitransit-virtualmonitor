import React, { FC } from 'react';
import Modal from '@hsl-fi/modal';
import { useTranslation } from 'react-i18next';

interface IProps {
  name: string;
  setDeleteModalOpen: any;
  onDeleteCallBack: any;
}

const DeleteModal: FC<IProps> = ({
  name,
  setDeleteModalOpen,
  onDeleteCallBack,
}) => {
  const [t] = useTranslation();
  return (
    <Modal
      appElement="#root"
      closeButtonLabel={t('close')}
      isOpen
      variant="small"
      onCrossClick={() => setDeleteModalOpen(false)}
      onClose={() => setDeleteModalOpen(false)}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
    >
      <div className="monitor-modal-content">
        <div className="message">
          {t('delete-confirmation', { monitor: name })}
        </div>
        <div className="monitor-modal-buttons">
          <button className="monitor-button blue" onClick={onDeleteCallBack}>
            {t('delete')}
          </button>
          <button
            className="monitor-button white"
            onClick={() => setDeleteModalOpen(false)}
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
