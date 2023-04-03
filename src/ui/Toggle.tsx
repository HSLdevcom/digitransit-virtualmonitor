import uniqueId from 'lodash/uniqueId';
import React, { FC } from 'react';
import cx from 'classnames';

interface IProps {
  toggled?: boolean;
  title?: string;
  onToggle?: (boolean) => void;
  id?: any;
  disabled?: boolean;
}
const Toggle: FC<IProps> = ({ toggled, title, onToggle, id, disabled }) => {
  const useId = id || uniqueId('input-');
  if (disabled && toggled) {
    onToggle(false);
  }
  return (
    <div className="option-toggle-container" title={title}>
      <div className="toggle">
        <input
          type="checkbox"
          id={useId}
          checked={toggled}
          onChange={() => {
            onToggle(!toggled);
          }}
          disabled={disabled}
        />
        <span className={cx('slider round', { disabled })} />
      </div>
    </div>
  );
};

export default Toggle;
