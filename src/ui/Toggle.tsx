import uniqueId from 'lodash/uniqueId';
import React, { FC } from 'react';

interface IProps {
  toggled?: boolean;
  title?: string;
  onToggle?: (boolean) => void;
  id?: any;
}
const Toggle: FC<IProps> = ({ toggled, title, onToggle, id }) => {
  const useId = id || uniqueId('input-');
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
        />
        <span className="slider round" />
      </div>
    </div>
  );
};

export default Toggle;
