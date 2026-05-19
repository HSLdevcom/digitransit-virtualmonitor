import React, { FC } from 'react';
import Modal from '@hsl-fi/modal';
import { useTranslation } from 'react-i18next';
import Loading from './Loading';

interface IProps {
  name: string;
  setDeleteModalOpen: any;
  onDeleteCallBack: any;
  loading?: boolean;
}

const DeleteModal: FC<IProps> = ({
  name,
  setDeleteModalOpen,
  onDeleteCallBack,
  loading,
}) => {
  const [t] = useTranslation();
  return (
    <Modal
      appElement="#root"
      contentLabel={t('delete-display', { id: name })}
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
          <button
            aria-disabled={loading || undefined}
            aria-busy={loading || undefined}
            className="monitor-button blue"
            onClick={() => {
              if (loading) return;
              onDeleteCallBack();
            }}
          >
            {loading ? <Loading small primary /> : <>{t('delete')}</>}
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
