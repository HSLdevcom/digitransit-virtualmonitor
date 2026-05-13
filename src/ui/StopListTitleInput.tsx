import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ITitle } from '../util/Interfaces';
import InputWithEditIcon from './InputWithEditIcon';
interface IProps {
  lang: string;
  updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
    lang?: string,
  ) => void;
  cardInfoId: number;
  side: 'left' | 'right';
  value: ITitle;
}
const StopListTitleInput: FC<IProps> = ({
  lang,
  updateCardInfo,
  cardInfoId,
  side,
  value,
}) => {
  const [t] = useTranslation();

  const onChange = (title, side) => {
    if (updateCardInfo) {
      updateCardInfo(cardInfoId, `title-${side}`, title, lang);
    }
  };

  return (
    <div className="stop-list-title-input">
      <label className="header" htmlFor={`stop-list-title-input-${side}-${lang}`}>
        {t(`header-side-${side}`).concat(' - ').concat(lang.toUpperCase())}
      </label>
      <InputWithEditIcon
        onChange={title => onChange(title, side)}
        id={`stop-list-title-input-${side}-${lang}`}
        value={value[lang]}
        inputProps={{ placeholder: t(`side${side}`), maxLength: 13 }}
        ariaLabelEdit={
          t('modify') +
          ' ' +
          t(`header-side-${side}`) +
          ' - ' +
          lang.toUpperCase()
        }
      />
    </div>
  );
};

export default StopListTitleInput;
