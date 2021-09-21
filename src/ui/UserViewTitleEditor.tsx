import React, { FC, useState } from 'react';
import Icon from './Icon';
import { WithTranslation, withTranslation } from 'react-i18next';
import { focusToInput, onClick } from './InputUtils';
import { isKeyboardSelectionEvent } from '../util/browser';
interface IProps {
  title: string;
  updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
    lang?: string,
  ) => void;
}

const UserViewTitleEditor: FC<IProps & WithTranslation> = ({
  title,
  updateCardInfo,
  t,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const [isFocus, setisFocus] = useState(false);

  const onBlur = event => {
    setisFocus(false);
    if (updateCardInfo) {
      //updateCardInfo(id, 'title', event.target.value, lang);
      console.log('Update title...');
    }
  };

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setisFocus(true);
  }

  const onChange = e => {
    setNewTitle(e.target.value);
  };

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
        <div className="delete-icon" onClick={() => console.log('Delete....')}>
          <Icon img="delete" color={'#007AC9'} />
        </div>
      </div>
    </div>
  );
};

export default withTranslation('translations')(UserViewTitleEditor);
