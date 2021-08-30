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

  useEffect(() => {
    const next = (current + 1) % alerts.length;
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
      <div className={cx("information-monitor-container", {preview: preview})}>
        {languages.map(language => {
          const header = alerts[current].alertHeaderTextTranslations.find(
            a => a.language === language,
          ).text;
          const description = alerts[
            current
          ].alertDescriptionTextTranslations.find(
            a => a.language === language,
          ).text;
          return (
            <>
              <h2 className="alert-header">
                {description.includes(header) ? description : header}
              </h2>
              {!description.includes(header) && (
                <div className="alert-description">{description}</div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default InformationDisplayCarousel;
