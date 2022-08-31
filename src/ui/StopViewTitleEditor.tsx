import cx from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { ICardInfo } from '../util/Interfaces';
import Icon from './Icon';
import { useTranslation } from 'react-i18next';
import { focusToInput, onClick } from '../util/InputUtils';
import { getLayout } from '../util/getLayout';
import { isKeyboardSelectionEvent } from '../util/browser';
import { getPrimaryColor } from '../util/getConfig';

interface IProps {
  card: ICardInfo;
  updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
    lang?: string,
  ) => void;
  lang: string;
}

const StopViewTitleEditor: FC<IProps> = ({ card, updateCardInfo, lang }) => {
  const { index, layout, id, title } = card;
  const [t] = useTranslation();
  const { isMultiDisplay } = getLayout(layout);
  const [newTitle, setNewTitle] = useState(
    isMultiDisplay ? t('layout') : title[lang],
  );

  useEffect(() => {
    setNewTitle(isMultiDisplay ? t('layout') : title[lang]);
  }, [card]);

  const [isFocus, setisFocus] = useState(false);

  const onBlur = event => {
    setisFocus(false);
    if (updateCardInfo) {
      updateCardInfo(id, 'title', event.target.value, lang);
    }
  };
  const layoutTitle = t('layout-double');

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setisFocus(true);
  }

  const onChange = e => {
    setNewTitle(e.target.value);
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
            placeholder={t('viewEditorName')}
            onKeyDown={e => isKeyboardSelectionEvent(e)}
            onBlur={e => !isKeyboardSelectionEvent(e) && onBlur(e)}
            onFocus={e => {
              handleFocus(e);
            }}
            value={newTitle}
          />
        )}
        {isMultiDisplay && (
          <input
            className={cx('stop-title-input', 'double')}
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
