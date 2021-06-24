import cx from 'classnames';
import uniqueId from 'lodash/uniqueId';
import React, { FC } from 'react';
import { isKeyboardSelectionEvent } from '../util/browser';
import Icon from './Icon';
import './CheckBox.scss';

interface IProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (option: string) => void;
  name: string;
}

const Checkbox: FC<IProps> = ({
  checked,
  disabled = false,
  onChange,
  name,
}) => {
  const id = uniqueId('input-');
  return (
    <div className={cx('option-checkbox-container')}>
      <div
        aria-checked={checked}
        className={cx('option-checkbox')}
        onKeyPress={e =>
          !disabled && isKeyboardSelectionEvent(e) && onChange(name)
        }
        role="checkbox"
        tabIndex={disabled ? -1 : 0}
      >
        <label className={cx({ checked, disabled })} htmlFor={id}>
          {checked && <Icon img="checkbox" width={20} height={20} />}
          <input
            aria-label={name}
            checked={checked}
            disabled={disabled}
            id={id}
            onChange={e => !disabled && onChange(name)}
            type="checkbox"
            name={name}
          />
        </label>
      </div>
    </div>
  );
};

export default Checkbox;
