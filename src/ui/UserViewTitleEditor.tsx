import React, { FC, useState } from 'react';
import Icon from './Icon';
import { focusToInput, onClick } from '../util/InputUtils';
import { isKeyboardSelectionEvent } from '../util/browser';
import { Redirect } from 'react-router-dom';
import monitorAPI from '../api';
import { getPrimaryColor } from '../util/getConfig';
import { useTranslation } from 'react-i18next';
import { getStaticUrl } from '../util/monitorUtils';

interface IProps {
  title: string;
  updateViewTitle: (newTitle: string) => void;
  contentHash?: string;
  monitorId?: string;
}

const UserViewTitleEditor: FC<IProps> = ({
  title,
  updateViewTitle,
  contentHash,
  monitorId,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const [isFocus, setFocus] = useState(false);
  const [isDeleted, setDeleted] = useState(false);
  const [t] = useTranslation();

  const url = getStaticUrl(window.location.pathname);
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
    if (contentHash && url) {
      monitorAPI.deleteStatic(monitorId, url).then(res => {
        setDeleted(true);
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
            <Icon img="edit" color={getPrimaryColor()} />
          </div>
        )}
      </div>
      <div className="delete-icon" onClick={onDelete}>
        <Icon img="delete" color={getPrimaryColor()} />
      </div>
    </div>
  );
};

export default UserViewTitleEditor;
