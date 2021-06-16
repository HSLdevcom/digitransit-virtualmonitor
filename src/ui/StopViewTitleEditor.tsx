import React, { FC, useState } from 'react';
import './StopViewTitleEditor.scss';
import Icon from './Icon';
import { WithTranslation, withTranslation } from 'react-i18next';
import { focusToInput, onClick } from './InputUtils';
import { getLayout } from '../util/getLayout';
interface IProps {
  id: number;
  layout: number;
  title: string;
  updateCardInfo?: (cardId: number, type: string, value: string) => void;
}

const StopViewTitleEditor: FC<IProps & WithTranslation> = ({
  id,
  layout,
  title,
  updateCardInfo,
  t,
}) => {
  const [newTitle, setNewTitle] = useState(
    getLayout(layout)[2] ? t('layout') : title,
  );
  const [changed, setChanged] = useState(false);

  const onBlur = event => {
    if (updateCardInfo) {
      updateCardInfo(id, 'title', event.target.value);
      setChanged(true);
    }
  };

  const isKeyboardSelectionEvent = event => {
    const backspace = [8, 'Backspace'];
    const space = [13, ' ', 'Spacebar'];
    const enter = [32, 'Enter'];

    const key = (event && (event.key || event.which || event.keyCode)) || '';

    if (
      key &&
      typeof event.target.selectionStart === 'number' &&
      event.target.selectionStart === 0 &&
      event.target.selectionEnd === event.target.value.length &&
      event.target.value === newTitle
    ) {
      if (backspace.concat(space).includes(key)) {
        setNewTitle('');
        setChanged(true);
      } else if (key.length === 1) {
        setNewTitle(key);
        setChanged(true);
      }
      return false;
    }

    if (key && backspace.includes(key)) {
      setNewTitle(newTitle.slice(0, -1));
      setChanged(true);
      return false;
    }

    if (!key || !enter.includes(key)) {
      if (key.length === 1) {
        setNewTitle(newTitle.concat(key));
        setChanged(true);
      }
      return false;
    }

    event.preventDefault();
    if (updateCardInfo) {
      updateCardInfo(id, 'title', newTitle);
      setChanged(false);
    }
    return true;
  };
  const layoutTitle = t('layoutEastWest');
  return (
    <div className="stop-title">
      <p className="description">
        {getLayout(layout)[2] ? t('layout') : t('stoptitle')}
      </p>
      <div className="stop-title-input-container">
        {!getLayout(layout)[2] && (
          <input
            className="stop-title-input"
            id={`stop-title-input${id}`}
            onClick={e => onClick(e)}
            onKeyDown={e => isKeyboardSelectionEvent(e)}
            onBlur={e => !isKeyboardSelectionEvent(e) && onBlur(e)}
            value={changed ? newTitle : title}
          />
        )}
        {getLayout(layout)[2] && (
          <input
            className="stop-title-input"
            id={`stop-title-input${id}`}
            value={layoutTitle}
            readOnly
          />
        )}
        {!getLayout(layout)[2] && (
          <div
            role="button"
            onClick={() => focusToInput(`stop-title-input${id}`)}
          >
            <Icon img="edit" color={'#007ac9'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default withTranslation('translations')(StopViewTitleEditor);
