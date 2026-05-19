import cx from 'classnames';
import React, { FC } from 'react';
import { ICardInfo } from '../util/Interfaces';
import { useTranslation } from 'react-i18next';
import { focusToInput, onClick } from '../util/InputUtils';
import { getLayout } from '../util/getResources';
import { isKeyboardSelectionEvent } from '../util/browser';
import { ConfigContext } from '../contexts';

import InputWithEditIcon from './InputWithEditIcon';
import { SupportedLanguage } from '../i18n';

interface IProps {
  card: ICardInfo;
  updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
    lang?: string,
  ) => void;
  lang: SupportedLanguage;
  isMap?: boolean;
}

const StopViewTitleEditor: FC<IProps> = ({
  card,
  updateCardInfo,
  lang,
  isMap,
}) => {
  const { index, layout, id, title } = card;
  const [t] = useTranslation();
  const { isDoubleView } = getLayout(layout);

  const layoutTitle = t('layout-double');
  const onChange = title => {
    updateCardInfo(id, 'title', title, lang);
  };
  const name = isMap ? 'maptitle' : 'stoptitle';
  const titleDescription = t(name).concat(' - ').concat(lang.toUpperCase());
  const inputID = `stop-title-input${id}-${lang}`;
  return (
    <div className="stop-title">
      {isDoubleView ? (
        <p className="description">{t('layout')}</p>
      ) : (
        <label htmlFor={inputID} className="description">
          {titleDescription}
        </label>
      )}
      <div className="stop-title-input-container">
        {!isDoubleView && (
          <InputWithEditIcon
            onChange={onChange}
            id={inputID}
            value={title[lang]}
            inputProps={{
              maxLength: 15,
              placeholder: t('viewEditorName'),
            }}
            ariaLabelEdit={`${t('modify')} ${t(name, {
              id: index + 1,
            })} ${t(`language-name-${lang}`)}`}
          />
        )}
        {isDoubleView && (
          <span className={cx('monitor-input', 'double')}>{layoutTitle}</span>
        )}
      </div>
    </div>
  );
};

export default StopViewTitleEditor;
