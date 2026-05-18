import cx from 'classnames';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
interface IProps {
  white?: boolean;
  isPreview?: boolean;
  small?: boolean;
  primary?: boolean;
}
const Loading: FC<IProps> = props => {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      className={cx('loading-container', {
        white: props.white,
        small: props.small,
        primary: props.primary,
      })}
    >
      <span className="sr-only">{t('loading')}</span>
      <Icon img="spinner" />
    </div>
  );
};

export default Loading;
