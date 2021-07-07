import cx from 'classnames';
import React, { FC } from 'react';
import './Loading.scss';
interface IProps {
  monitor?: boolean;
  isPreview?: boolean;
}
const Loading: FC<IProps> = props => (
  <div
    className={cx(
      'foo',
      props.monitor && !props.isPreview
        ? 'monitor'
        : props.monitor && props.isPreview
        ? 'preview'
        : '',
    )}
  >
    <div className="lds-ring">
      <div className={cx(props.isPreview && 'preview')}></div>
      <div className={cx(props.isPreview && 'preview')}></div>
      <div className={cx(props.isPreview && 'preview')}></div>
      <div className={cx(props.isPreview && 'preview')}></div>
    </div>
  </div>
);

export default Loading;
