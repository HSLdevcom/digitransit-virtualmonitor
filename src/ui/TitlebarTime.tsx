import React, { FC } from 'react';
import AutoMoment from './AutoMoment';
import { EpochMilliseconds, Milliseconds } from '../time';
import cx from 'classnames';

interface IProps {
  isPreview?: boolean;
  isLandscape?: boolean;
}

const TitlebarTime: FC<IProps> = ({
  isPreview = false,
  isLandscape = false,
}) => {
  return (
    <div
      className={cx(
        'title-time-container',
        isPreview ? 'preview' : '',
        isLandscape ? '' : 'portrait',
      )}
    >
      <div
        className={cx(
          'title-time',
          isPreview ? 'preview' : '',
          isLandscape ? '' : 'portrait',
        )}
      >
        <AutoMoment />
      </div>
    </div>
  );
};

export default TitlebarTime;
