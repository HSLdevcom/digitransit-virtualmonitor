import cx from 'classnames';
import React, { FC } from 'react';
import Icon from './Icon';
interface IProps {
  white?: boolean;
  isPreview?: boolean;
}
const Loading: FC<IProps> = props => (
  <div className={cx('loading-container', { white: props.white })}>
    <Icon img="spinner" />
  </div>
);

export default Loading;
