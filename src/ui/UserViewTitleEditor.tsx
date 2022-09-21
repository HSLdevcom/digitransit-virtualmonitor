import React, { FC, useContext, useState } from 'react';
import Icon from './Icon';
import { Redirect } from 'react-router-dom';
import monitorAPI from '../api';
import { useTranslation } from 'react-i18next';
import DeleteModal from './DeleteModal';
import { getParams } from '../util/queryUtils';
import { ConfigContext } from '../contexts';
import InputWithEditIcon from './InputWithEditIcon';

interface IProps {
  title: string;
  updateViewTitle: (newTitle: string) => void;
  monitorId?: string;
}

const UserViewTitleEditor: FC<IProps> = ({
  title,
  updateViewTitle,
  monitorId,
}) => {
  const config = useContext(ConfigContext);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [t] = useTranslation();

  const { url } = getParams(window.location.search);

  const onDelete = () => {
    setDeleting(true);
    if (monitorId && url) {
      monitorAPI.deleteStatic(monitorId, url).then(res => {
        setDeleted(true);
        setDeleting(false);
      });
    } else {
      setDeleted(true);
    }
  };

  if (isDeleted) {
    return (
      <Redirect
        to={{
          pathname: '/monitors',
        }}
      />
    );
  }

  return (
    <div className="user-view-title">
      {deleteModalOpen && (
        <DeleteModal
          loading={deleting}
          name={title}
          setDeleteModalOpen={setDeleteModalOpen}
          onDeleteCallBack={onDelete}
        />
      )}
      <div className="user-view-title-input-container">
        <InputWithEditIcon
          id="user-view-title-input"
          onChange={t => updateViewTitle(t)}
          value={title}
          inputProps={{
            placeholder: t('staticMonitorTitle'),
            maxLength: 25,
          }}
        />
      </div>
      <button className="delete-icon" onClick={() => setDeleteModalOpen(true)}>
        <Icon img="delete" color={config.colors.primary} />
      </button>
    </div>
  );
};

export default UserViewTitleEditor;
