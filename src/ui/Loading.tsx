import cx from 'classnames';
import React, { FC } from 'react';
import Icon from './Icon';
interface IProps {
  white?: boolean;
  isPreview?: boolean;
  small?: boolean;
  primary?: boolean;
}
const Loading: FC<IProps> = props => (
  <div
    className={cx('loading-container', {
      white: props.white,
      small: props.small,
      primary: props.primary,
    })}
  >
    <Icon img="spinner" />
  </div>
);

export default Loading;
