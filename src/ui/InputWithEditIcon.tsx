import React, { FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from '../contexts';
import { focusToInput } from '../util/InputUtils';
import Icon from './Icon';

interface IProps {
  onChange: (string) => void;
  id: string;
  value: string;
  inputProps?: any;
  ariaLabelEdit?: string;
}

const InputWithEditIcon: FC<IProps> = ({
  onChange,
  id,
  value,
  inputProps = {},
  ariaLabelEdit,
}) => {
  const config = useContext(ConfigContext);
  const [t] = useTranslation();

  const [focus, setFocus] = useState(false);
  return (
    <div className={'monitor-input-container'}>
      <input
        className={'monitor-input'}
        id={id}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={e => onChange(e.target.value)}
        value={value}
        {...inputProps}
      />
      {!focus && (
        <button
          aria-label={ariaLabelEdit || t('edit')}
          onClick={() => focusToInput(id)}
        >
          <Icon img="edit" color={config.colors.primary} />
        </button>
      )}
    </div>
  );
};

export default InputWithEditIcon;
