import cx from 'classnames';
import React, { FC, useState } from 'react';
import { ITitle } from '../util/Interfaces';
import Icon from './Icon';
import { WithTranslation, withTranslation } from 'react-i18next';
import { focusToInput, onClick } from './InputUtils';
import { getLayout } from '../util/getLayout';
import { isKeyboardSelectionEvent } from '../util/browser';
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
  const { isMultiDisplay } = getLayout(layout);
  const [newTitle, setNewTitle] = useState(
    isMultiDisplay ? t('layout') : title,
  );
  const [isFocus, setisFocus] = useState(false);

  const onBlur = event => {
    setisFocus(false);
    if (updateCardInfo) {
      updateCardInfo(id, 'title', event.target.value, lang);
    }
  };
  const layoutTitle = t('layoutEastWest');

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setisFocus(true);
  }

  const onChange = e => {
    setNewTitle({ ...newTitle, [lang]: e.target.value });
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
           // maxLength={5} TODO: Define max length.
            onKeyDown={e => isKeyboardSelectionEvent(e)}
            onBlur={e => !isKeyboardSelectionEvent(e) && onBlur(e)}
            onFocus={e => {
              handleFocus(e);
            }}
            value={newTitle[lang]}
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
