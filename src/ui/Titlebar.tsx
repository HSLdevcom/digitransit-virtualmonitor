import React, { FC } from 'react';
import cx from 'classnames';
export interface ITitlebarProps {
  readonly isPreview?: boolean;
  readonly isLandscape?: boolean;
  readonly isDoubleView?: boolean;
  readonly children?: React.ReactNode;
}

const Titlebar: FC<ITitlebarProps> = ({
  isPreview,
  isLandscape,
  isDoubleView,
  children,
}) => {
  return (
    <div
      className={cx('title-bar', {
        preview: isPreview,
        portrait: !isLandscape,
        doubleView: isDoubleView,
      })}
    >
      {children}
    </div>
  );
};

export default Titlebar;
