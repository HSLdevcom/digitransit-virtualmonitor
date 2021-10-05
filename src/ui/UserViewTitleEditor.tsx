import React, { FC, useState } from 'react';
import Icon from './Icon';
import { WithTranslation, withTranslation } from 'react-i18next';
import { focusToInput, onClick } from './InputUtils';
import { isKeyboardSelectionEvent } from '../util/browser';
import { Redirect } from 'react-router-dom';
import monitorAPI from '../api';

interface IProps {
  title: string;
  updateViewTitle: (newTitle: string) => void;
  backToList: () => void;
  contentHash?: string;
  url?: string;
  isNew: boolean;
}

const UserViewTitleEditor: FC<IProps & WithTranslation> = ({
  title,
  updateViewTitle,
  backToList,
  isNew,
  contentHash,
  url,
  t,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const [isFocus, setFocus] = useState(false);
  const [isDeleted, setDeleted] = useState(false);

  const onBlur = event => {
    setFocus(false);
    updateViewTitle(newTitle);
  };

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setFocus(true);
  }

  const onChange = e => {
    setNewTitle(e.target.value);
  };

  const onDelete = () => {
    if (contentHash && url) {
      monitorAPI.deleteStatic(contentHash, url).then(res => {
        setDeleted(true);
      });
    }
  };

  if (isDeleted) {
    return (
      <Redirect
        to={{
          pathname: '/',
          search: `?pocLogin`,
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
          onBlur={e => !isKeyboardSelectionEvent(e) && onBlur(e)}
          onFocus={e => {
            handleFocus(e);
          }}
          value={newTitle}
        />

        {!isFocus && (
          <div
            className="user-view-title-input-button"
            role="button"
            onClick={() => focusToInput('user-view-title-input')}
          >
            <Icon img="edit" color={'#007ac9'} />
          </div>
        )}
        <div className="delete-icon" onClick={isNew ? backToList : onDelete}>
          <Icon img="delete" color={'#007AC9'} />
        </div>
      </div>
    </div>
  );
};

export default withTranslation('translations')(UserViewTitleEditor);
