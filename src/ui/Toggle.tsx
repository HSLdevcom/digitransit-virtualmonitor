import uniqueId from 'lodash/uniqueId';
import React, { FC, useEffect } from 'react';
import cx from 'classnames';

interface IProps {
  toggled?: boolean;
  onToggle?: (boolean) => void;
  id?: string;
  disabled?: boolean;
  // Use aria-disabled internally; native disabled is intentionally avoided
  // so the control remains in the tab order and discoverable by keyboard users.
}
const Toggle: FC<IProps> = ({ toggled, onToggle, id, disabled }) => {
  const useId = id || uniqueId('input-');
  useEffect(() => {
    if (disabled && toggled) {
      onToggle(false);
    }
  }, [disabled, toggled]);
  return (
    <span className="option-toggle-container">
      <span className="toggle">
        <input
          type="checkbox"
          id={useId}
          checked={toggled}
          aria-disabled={disabled || undefined}
          onChange={() => {
            if (disabled) return;
            onToggle(!toggled);
          }}
        />
        <span className={cx('slider round', { disabled })} />
      </span>
    </span>
  );
};

export default Toggle;
