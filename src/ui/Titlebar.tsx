import React, { FC } from 'react';
import cx from 'classnames';
export interface ITitlebarProps {
  readonly isPreview?: boolean;
  readonly isLandscape?: boolean;
  readonly isMultiDisplay?: boolean;
  readonly children?: React.ReactNode;
}

const Titlebar: FC<ITitlebarProps> = ({
  isPreview,
  isLandscape,
  isMultiDisplay,
  children,
}) => {
  return (
    <div
      className={cx('title-bar', {
        preview: isPreview,
        portrait: !isLandscape,
        multiDisplay: isMultiDisplay,
      })}
    >
      {children}
    </div>
  );
};

export default Titlebar;
