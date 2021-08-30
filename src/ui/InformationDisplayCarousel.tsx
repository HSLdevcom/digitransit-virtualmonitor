import React, { FC, useState, useEffect } from 'react';
import { IAlert, IView } from '../util/Interfaces';
import cx from 'classnames';
import MonitorTitlebar from './MonitorTitleBar';
import { getConfig } from '../util/getConfig';

interface IProps {
  alerts: Array<IAlert>;
  languages: Array<string>;
  preview?: boolean;
  view: IView;
}

const InformationDisplayCarousel: FC<IProps> = ({
  view,
  alerts,
  languages,
  preview = false,
}) => {
  const [current, setCurrent] = useState(0);
  const carouselLength = alerts.length * languages.length;

  useEffect(() => {
    const next = (current + 1) % carouselLength;
    const to = setTimeout(() => {
      setCurrent(next);
    }, 20000);
    return () => clearTimeout(to);
  }, [current]);
  const config = getConfig();
  return (
    <div
      className={cx('main-content-container', {
        preview: preview,
      })}
    >
      <MonitorTitlebar
        isLandscape
        view={view}
        currentLang={'fi'}
        preview={preview}
        config={config}
        currentTime={new Date().getTime()}
      />
      <div className="information-monitor-container">
        <h2 className="alert-header">
          {
            alerts[
              Math.floor(current / languages.length)
            ].alertHeaderTextTranslations.find(
              a =>
                a.language === languages[Math.floor(current % alerts.length)],
            ).text
          }
        </h2>
        <div className="alert-description">
          {
            alerts[
              Math.floor(current / languages.length)
            ].alertDescriptionTextTranslations.find(
              a =>
                a.language === languages[Math.floor(current % alerts.length)],
            ).text
          }
        </div>
      </div>
    </div>
  );
};

export default InformationDisplayCarousel;
