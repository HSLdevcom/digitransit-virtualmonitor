import React, { FC } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import cx from 'classnames';
import Select from 'react-select';
import Icon from './Icon';
import { v4 as uuid } from 'uuid';
import { getPrimaryColor } from '../util/getConfig';

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

const Dropdown: FC<IProps & WithTranslation> = ({
  name,
  indicatorColor,
  isSearchable,
  options,
  placeholder,
  handleChange,
  isDisabled = false,
  t,
}) => {
  const ddIndicator = (
    <Icon
      img="arrow-down"
      color={indicatorColor ? indicatorColor : getPrimaryColor()}
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
