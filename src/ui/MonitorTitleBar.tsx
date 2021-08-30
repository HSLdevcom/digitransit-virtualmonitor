import React, { FC } from 'react';
import { IMonitorConfig, IView } from '../util/Interfaces';
import Logo from './logo/Logo';
import Titlebar from './Titlebar';
import TitlebarTime from './TitlebarTime';
import cx from 'classnames';

interface IProps {
  config: IMonitorConfig;
  preview: boolean;
  isMultiDisplay?: boolean;
  isLandscape?: boolean;
  view: IView;
  currentLang: string;
  currentTime: number;
}
const MonitorTitlebar: FC<IProps> = ({
  currentTime,
  view,
  config,
  preview,
  isMultiDisplay = false,
  isLandscape = false,
  currentLang,
}) => {
  return (
    <Titlebar isPreview={preview} isLandscape={isLandscape}>
      <Logo
        monitorConfig={config}
        isPreview={preview}
        isLandscape={isLandscape}
      />
      {!isMultiDisplay && (
        <div className={cx('title-text', { preview: preview })}>
          {view.title[currentLang]}
        </div>
      )}
      {isMultiDisplay && (
        <div className="multi-display-titles">
          <div className="left-title">
            {view.columns.left.title[currentLang]}
          </div>
          <div className="right-title">
            {view.columns.right.title[currentLang]}
          </div>
        </div>
      )}
      <TitlebarTime
        currentTime={currentTime}
        isPreview={preview}
        isLandscape={isLandscape}
      />
    </Titlebar>
  );
};

export default MonitorTitlebar;
