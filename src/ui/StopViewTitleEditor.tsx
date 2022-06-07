import cx from 'classnames';
import React, { FC, useState } from 'react';
import { ITitle } from '../util/Interfaces';
import Icon from './Icon';
import { useTranslation } from 'react-i18next';
import { focusToInput, onClick } from '../util/InputUtils';
import { getLayout } from '../util/getLayout';
import { isKeyboardSelectionEvent } from '../util/browser';
import { getPrimaryColor } from '../util/getConfig';

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
  index: number;
}

const StopViewTitleEditor: FC<IProps> = ({
  id,
  layout,
  title,
  updateCardInfo,
  lang,
  index,
}) => {
  const [t] = useTranslation();
  const { isMultiDisplay } = getLayout(layout);
  const [titleChanged, setTitleChanged] = useState(false);
  const [newTitle, setNewTitle] = useState(
    isMultiDisplay ? t('layout') : title,
  );
  const [isFocus, setisFocus] = useState(false);

  const onBlur = event => {
    setisFocus(false);
    if (updateCardInfo) {
      updateCardInfo(id, 'title', event.target.value, lang);
      setTitleChanged(false);
    }
  };
  const layoutTitle = t('layoutEastWest');

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setisFocus(true);
  }

  const onChange = e => {
    setNewTitle({ ...newTitle, [lang]: e.target.value });
    setTitleChanged(true);
  };

  const titleDescription = t('stoptitle')
    .concat(' - ')
    .concat(lang.toUpperCase());
  return (
    <div className="stop-title">
      <p className="description">
        {isMultiDisplay ? t('layout') : titleDescription}
      </p>
      <div className="stop-title-input-container">
        {!isMultiDisplay && (
          <input
            className="stop-title-input"
            id={`stop-title-input${id}-${lang}`}
            onClick={e => onClick(e)}
            onChange={e => onChange(e)}
            maxLength={15}
            onKeyDown={e => isKeyboardSelectionEvent(e)}
            onBlur={e => !isKeyboardSelectionEvent(e) && onBlur(e)}
            onFocus={e => {
              handleFocus(e);
            }}
            value={titleChanged ? newTitle[lang] : title[lang]}
          />
        )}
        {isMultiDisplay && (
          <input
            className={cx('stop-title-input', 'east-west')}
            id={`stop-title-input${id}-${lang}`}
            value={layoutTitle}
            readOnly
          />
        )}
        {!isMultiDisplay && !isFocus && (
          <div
            tabIndex={-1}
            role="button"
            onClick={() => focusToInput(`stop-title-input${id}-${lang}`)}
            aria-label={
              t('modify') +
              ' ' +
              t('stoptitle', { id: index + 1 }) +
              ' ' +
              t(`languageName${lang.charAt(0).toUpperCase() + lang.slice(1)}`)
            }
          >
            <Icon img="edit" color={getPrimaryColor()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StopViewTitleEditor;
