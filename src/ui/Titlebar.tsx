import React, { FC } from 'react';
import cx from 'classnames';
export interface ITitlebarProps {
  readonly isPreview?: boolean;
  readonly isLandscape?: boolean;
  readonly children?: React.ReactNode;
}

const Titlebar: FC<ITitlebarProps> = ({ isPreview, isLandscape, children }) => {
  return (
    <div
      className={cx('title-bar', {
        preview: isPreview,
        portrait: !isLandscape,
      })}
    >
      {children}
    </div>
  );
};

export default Titlebar;
