import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import InputWithEditIcon from './InputWithEditIcon';
interface IProps {
  lang: string;
  setTitle: (side: string, title?: string) => void;
  updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
    lang?: string,
  ) => void;
  cardInfoId: number;
  side: string;
  value: string;
}
const StopListTitleInput: FC<IProps> = ({
  lang,
  setTitle,
  updateCardInfo,
  cardInfoId,
  side,
  value,
}) => {
  const [t] = useTranslation();

  const onChange = (title, side) => {
    setTitle(title);
    if (updateCardInfo) {
      updateCardInfo(cardInfoId, `title-${side}`, title, lang);
    }
  };

  return (
    <div className="stop-list-title-input">
      <div className="header">
        {t(`header-side-${side}`).concat(' - ').concat(lang.toUpperCase())}
      </div>
      <InputWithEditIcon
        onChange={title => onChange(title, side)}
        id={`stop-list-title-input-${side}-${lang}`}
        value={value[lang]}
        inputProps={{ placeholder: t(`side${side}`), maxLength: 13 }}
      />
    </div>
  );
};

export default StopListTitleInput;
