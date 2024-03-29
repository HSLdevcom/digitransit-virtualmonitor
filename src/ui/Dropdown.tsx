import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import Select from 'react-select';
import Icon from './Icon';
import { v4 as uuid } from 'uuid';
import { ConfigContext } from '../contexts';

interface IOption {
  value: string;
  label: string;
}
interface IProps {
  readonly name: string;
  readonly indicatorColor?: string;
  readonly options?: Array<Option>;
  readonly placeholder?: string | JSX.Element;
  readonly handleChange?: (option: IOption) => void;
  isDisabled?: boolean;
}

interface Option {
  label: string | JSX.Element;
  options?: Array<NestedOption>;
  value?: number;
}

interface NestedOption {
  label: string | JSX.Element;
  value: number;
}

const Dropdown: FC<IProps> = ({
  name,
  indicatorColor,
  options,
  placeholder,
  handleChange,
  isDisabled = false,
}) => {
  const [t] = useTranslation();
  const config = useContext(ConfigContext);
  const ddIndicator = (
    <Icon
      img="arrow-down"
      color={indicatorColor ? indicatorColor : config.colors.primary}
    />
  );

  return (
    <Select
      className={cx(
        'dd-select',
        name,
        {
          withMinWidth: !placeholder,
        },
        {
          withWidth: placeholder,
        },
      )}
      classNamePrefix={'dd'}
      components={{
        DropdownIndicator: () => ddIndicator,
        IndicatorSeparator: () => null,
      }}
      isDisabled={isDisabled}
      inputId={uuid()}
      name={name}
      options={options}
      placeholder={placeholder ? placeholder : t('dropdownPlaceHolder')}
      tabIndex="0"
      onChange={handleChange}
    />
  );
};

export default Dropdown;
