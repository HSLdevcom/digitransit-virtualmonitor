import * as React from 'react';
import cx from 'classnames';

import './Titlebar.scss';

export interface ITitlebarProps {
  readonly isPreview?: boolean;
  readonly isLandscape?: boolean;
  readonly children: React.ReactNode;
}

export default (props: ITitlebarProps) => {
  const orientation = props.isLandscape ? '' : 'portrait';
  return (
    <div
      className={cx('title-bar', props.isPreview ? 'preview' : '', orientation)}
    >
      {props.children}
    </div>
  );
};
