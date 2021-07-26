import cx from 'classnames';
import React from 'react';
import './ContentContainer.scss';
interface Props {
  children: React.ReactNode;
  longContainer?: boolean;
}

function ContentContainer(props: Props) {
  return (
    <div className={cx('content-wrapper', props.longContainer && 'front-page')}>
      {' '}
      {props.children}{' '}
    </div>
  );
}

export default ContentContainer;
