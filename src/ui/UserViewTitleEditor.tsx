import React, { FC, useContext, useState } from 'react';
import Icon from './Icon';
import { focusToInput, onClick } from '../util/InputUtils';
import { isKeyboardSelectionEvent } from '../util/browser';
import { Redirect } from 'react-router-dom';
import monitorAPI from '../api';
import { useTranslation } from 'react-i18next';
import DeleteModal from './DeleteModal';
import { getParams } from '../util/queryUtils';
import { ConfigContext } from '../contexts';

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
  const [newTitle, setNewTitle] = useState(title);
  const [isFocus, setFocus] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [t] = useTranslation();

  const { url } = getParams(window.location.search);

  const onBlur = event => {
    setFocus(false);
    updateViewTitle(newTitle);
  };

  function handleFocus() {
    setFocus(true);
  }

  const onChange = e => {
    setNewTitle(e.target.value);
  };

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
          name={newTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          onDeleteCallBack={onDelete}
        />
      )}
      <div className="user-view-title-input-container">
        <input
          className="user-view-title-input"
          id="user-view-title-input"
          onClick={e => onClick(e)}
          onChange={e => onChange(e)}
          maxLength={25}
          onKeyDown={e => isKeyboardSelectionEvent(e)}
          onBlur={e => onBlur(e)}
          placeholder={t('staticMonitorTitle')}
          onFocus={() => {
            handleFocus();
          }}
          value={newTitle}
        />

        {!isFocus && (
          <div
            className="user-view-title-input-button"
            role="button"
            onClick={() => focusToInput('user-view-title-input')}
          >
            <Icon img="edit" color={config.colors.primary} />
          </div>
        )}
      </div>
      <button className="delete-icon" onClick={() => setDeleteModalOpen(true)}>
        <Icon img="delete" color={config.colors.primary} />
      </button>
    </div>
  );
};

export default UserViewTitleEditor;
