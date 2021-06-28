import React, { FC } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import cx from 'classnames';
import Select from 'react-select';
import Icon from './Icon';
import './Dropdown.scss';

interface IOption {
  value: string;
  label: string;
}
interface IProps {
  readonly name: string;
  readonly indicatorColor?: string;
  readonly isSearchable?: boolean;
  readonly options?: Array<Option>;
  readonly placeholder?: string | JSX.Element;
  readonly handleChange?: (option: IOption) => void;
}

interface Option {
  label: string | JSX.Element;
  options?: Array<NestedOption>;
  value?: string;
}

interface NestedOption {
  label: string | JSX.Element;
  value: string;
}

const Dropdown: FC<IProps & WithTranslation> = ({
  name,
  indicatorColor,
  isSearchable,
  options,
  placeholder,
  handleChange,
  t,
}) => {
  const ddIndicator = (
    <Icon
      img="arrow-down"
      color={indicatorColor ? indicatorColor : '#007ac9'}
    />
  );

  return (
    <Select
      className={cx(
        'dd-select',
        {
          withMinWidth: !placeholder,
        },
        {
          withWidth: placeholder,
        },
        {
          duration: name === 'duration',
        },
      )}
      classNamePrefix={'dd'}
      components={{
        DropdownIndicator: () => ddIndicator,
        IndicatorSeparator: () => null,
      }}
      inputId={`aria-input-${name}`}
      isSearchable={isSearchable ? isSearchable : false}
      name={name}
      options={options}
      placeholder={placeholder ? placeholder : t('dropdownPlaceHolder')}
      tabIndex="0"
      onChange={handleChange}
    />
  );
};

export default withTranslation('translations')(Dropdown);
