import * as React from 'react';
import cx from 'classnames';

import './Titlebar.scss';

export interface ITitlebarProps {
  readonly isPreview?: boolean;
  readonly isLandscape?: boolean;
  readonly children: React.ReactNode;
}

export default (props: ITitlebarProps) => {
  const isPreview = props.isPreview || false;
  const isLandscape = props.isLandscape || true;
  return (
    <div
      className={cx(
        'title-bar',
        isPreview ? 'preview' : '',
        !isLandscape ? 'portrait' : '',
      )}
    >
      {props.children}
    </div>
  );
};
