import React, { FC, useContext, useRef } from 'react';
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
  'aria-label'?: string;
  'aria-labelledby'?: string;
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
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}) => {
  const [t] = useTranslation();
  const config = useContext(ConfigContext);
  const inputIdRef = useRef<string | null>(null);
  if (inputIdRef.current === null) {
    inputIdRef.current = uuid();
  }
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
      inputId={inputIdRef.current}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      name={name}
      options={options}
      placeholder={placeholder ? placeholder : '--'}
      tabIndex={0}
      onChange={handleChange}
    />
  );
};

export default Dropdown;
