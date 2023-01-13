import cx from 'classnames';
import React, { FC } from 'react';
import { ICardInfo } from '../util/Interfaces';
import { useTranslation } from 'react-i18next';
import { focusToInput, onClick } from '../util/InputUtils';
import { getLayout } from '../util/getResources';
import { isKeyboardSelectionEvent } from '../util/browser';
import { ConfigContext } from '../contexts';
import { getLayout } from '../util/getLayout';

import InputWithEditIcon from './InputWithEditIcon';

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

  const layoutTitle = t('layout-double');
  const onChange = title => {
    updateCardInfo(id, 'title', title, lang);
  };

  const titleDescription = t('stoptitle')
    .concat(' - ')
    .concat(lang.toUpperCase());
  const inputID = `stop-title-input${id}-${lang}`;
  return (
    <div className="stop-title">
      <p className="description">
        {isMultiDisplay ? t('layout') : titleDescription}
      </p>
      <div className="stop-title-input-container">
        {!isMultiDisplay && (
          <InputWithEditIcon
            onChange={onChange}
            id={inputID}
            value={title[lang]}
            inputProps={{
              maxLength: 15,
              placeholder: t('viewEditorName'),
            }}
            ariaLabelEdit={`${t('modify')} ${t('stoptitle', {
              id: index + 1,
            })} ${t(`language-name-${lang}`)}`}
          />
        )}
        {isMultiDisplay && (
          <input
            className={cx('monitor-input', 'double')}
            id={inputID}
            value={layoutTitle}
            tabIndex={-1}
            readOnly
          />
        )}
      </div>
    </div>
  );
};

export default StopViewTitleEditor;
