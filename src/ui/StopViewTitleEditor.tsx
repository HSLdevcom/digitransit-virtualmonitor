import React, { FC, useState } from 'react';
import './StopViewTitleEditor.scss';
import { ITitle } from '../util/Interfaces';
import Icon from './Icon';
import { WithTranslation, withTranslation } from 'react-i18next';
import { focusToInput, onClick } from './InputUtils';
import { getLayout } from '../util/getLayout';
interface IProps {
  id: number;
  layout: number;
  title: ITitle;
  updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
    lang?: string,
  ) => void;
  lang: 'fi' | 'sv' | 'en';
}

const StopViewTitleEditor: FC<IProps & WithTranslation> = ({
  id,
  layout,
  title,
  updateCardInfo,
  lang,
  t,
}) => {
  const [newTitle, setNewTitle] = useState(
    getLayout(layout)[2] ? t('layout') : title,
  );
  const [isFocus, setisFocus] = useState(false);
  const [changed, setChanged] = useState(false);
  const onBlur = event => {
    setisFocus(false);
    if (updateCardInfo) {
      updateCardInfo(id, 'title', event.target.value, lang);
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
      event.target.value === newTitle[lang]
    ) {
      if (backspace.concat(space).includes(key)) {
        const nTitle = { ...title, [lang]: '' };
        setNewTitle(nTitle);
        setChanged(true);
      } else if (key.length === 1) {
        setNewTitle({ ...newTitle, [lang]: key });
        setChanged(true);
      }
      return false;
    }

    if (key && backspace.includes(key)) {
      setNewTitle({ ...newTitle, [lang]: newTitle[lang].slice(0, -1) });
      setChanged(true);
      return false;
    }

    if (!key || !enter.includes(key)) {
      if (key.length === 1) {
        setNewTitle({
          ...newTitle,
          [lang]: newTitle[lang] ? newTitle[lang].concat(key) : key,
        });
        setChanged(true);
      }
      return false;
    }

    event.preventDefault();
    if (updateCardInfo) {
      const ntitle: ITitle = {
        ...title,
        [lang]: newTitle,
      };
      updateCardInfo(id, 'title', ntitle[lang]);
      setChanged(false);
    }
    return true;
  };
  const layoutTitle = t('layoutEastWest');

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setisFocus(true);
  }
  const titleDescription = t('stoptitle')
    .concat(' - ')
    .concat(lang.toUpperCase());
  return (
    <div className="stop-title">
      <p className="description">
        {getLayout(layout)[2] ? t('layout') : titleDescription}
      </p>
      <div className="stop-title-input-container">
        {!getLayout(layout)[2] && (
          <input
            className="stop-title-input"
            id={`stop-title-input${id}-${lang}`}
            onClick={e => onClick(e)}
            onKeyDown={e => isKeyboardSelectionEvent(e)}
            onBlur={e => !isKeyboardSelectionEvent(e) && onBlur(e)}
            onFocus={e => {
              handleFocus(e);
            }}
            value={changed ? newTitle[lang] : title[lang]}
          />
        )}
        {getLayout(layout)[2] && (
          <input
            className="stop-title-input"
            id={`stop-title-input${id}-${lang}`}
            value={layoutTitle}
            readOnly
          />
        )}
        {!getLayout(layout)[2] && !isFocus && (
          <div
            role="button"
            onClick={() => focusToInput(`stop-title-input${id}-${lang}`)}
          >
            <Icon img="edit" color={'#007ac9'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default withTranslation('translations')(StopViewTitleEditor);
