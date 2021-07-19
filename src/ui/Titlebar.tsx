import * as React from 'react';
import cx from 'classnames';

import './Titlebar.scss';

export interface ITitlebarProps {
  readonly isPreview?: boolean;
  readonly isLandscape?: boolean;
  readonly forcedLayout?: string;
  readonly children: React.ReactNode;
}

export default (props: ITitlebarProps) => {
  let orientation = props.isLandscape ? '' : 'portrait';
  if (props.forcedLayout) {
    orientation =
      props.forcedLayout === 'landscape' ? 'forcedLandscape' : 'forcedPortrait';
  }
  return (
    <div
      className={cx('title-bar', props.isPreview ? 'preview' : '', orientation)}
    >
      {props.children}
    </div>
  );
};
