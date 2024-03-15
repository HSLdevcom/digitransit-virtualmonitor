import React, { FC, useEffect, useState } from 'react';
import cx from 'classnames';
import {
  getServiceAlertDescription,
  getServiceAlertHeader,
} from '../util/alertUtils';

interface IProps {
  alerts: any;
  languages: any;
  preview: boolean;
  alertOrientation: string;
}
const getAnimationWidth = orientation => {
  const alertElements = document.getElementsByClassName('single-alert');
  const elementArray = alertElements;
  let animationWidth = 0;
  for (let i = 0; i < elementArray.length; i++) {
    if (orientation === 'vertical') {
      animationWidth += elementArray[i].clientHeight + 10;
    } else {
      animationWidth += elementArray[i].clientWidth;
    }
  }
  return animationWidth;
};

const MonitorAlertRow: FC<IProps> = ({
  preview,
  alerts,
  languages,
  alertOrientation,
}) => {
  const [animationWidth, setAnimationWidth] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [update, setUpdate] = useState(false);

  const updateAnimation = () => {
    const width = getAnimationWidth(alertOrientation);
    const windowWidth = preview ? 640 : window.innerWidth;
    const windowHeight = preview ? 370 : window.innerWidth;
    setAnimationWidth(width);
    alertOrientation === 'horizontal'
      ? setSpeed((width / windowWidth) * 10) // 10 means that it should take 10 seconds for a word appearing from the right to reach the left side of the screen
      : setSpeed((width / (windowHeight / 6)) * 5);
    setUpdate(true);
  };
  // ONLY NEEDED FOR DEMO TO WORK ---
  useEffect(() => {
    updateAnimation();
    const to = setTimeout(() => setUpdate(false), 100);
    return () => clearTimeout(to);
  }, [alertOrientation]);
  // ---------------------------------
  useEffect(() => {
    updateAnimation();
    const to = setTimeout(() => setUpdate(false), 100);
    window.addEventListener('resize', () => {
      updateAnimation();
      setTimeout(() => setUpdate(false), 100);
    });
    return () => clearTimeout(to);
  }, []);

  const DEFAULT_LANGUAGE = 'fi';

  const alertElements = alerts.flatMap((alert, i) => {
    const hasTranslations =
      alert.alertDescriptionTextTranslations ||
      alert.alertHeaderTextTranslations;
    const languagesToUse = hasTranslations ? languages : [DEFAULT_LANGUAGE];

    // Sort the languages so that they are always in order: fi, sv, en.
    const sortedLanguages = languagesToUse.sort((a, b) => {
      if (a === 'fi') return -1;
      if (b === 'fi') return 1;
      if (a === 'sv') return -1;
      if (b === 'sv') return 1;
      return 0;
    });
    const alertSpans = sortedLanguages.map((language, j) => {
      return (
        <span key={`alert-${i + 1}-lang-${j + 1}`} className="single-alert">
          {getServiceAlertDescription(alert, language) ||
            getServiceAlertHeader(alert, language)}
        </span>
      );
    });
    const isLastAlert = i === alerts.length - 1;
    const needsSeparator = !isLastAlert && alertOrientation !== 'horizontal';
    const separator = needsSeparator ? (
      <div key={`alert-${i + 1}-separator`} className="alert-separator"></div>
    ) : (
      []
    );

    return [...alertSpans, separator];
  });

  const style = {
    '--animationWidth': `${Number(-1 * animationWidth).toFixed(0)}px`,
    '--speed': `${Number(speed).toFixed(0)}s`,
  } as React.CSSProperties;
  return (
    <div style={style} className={cx('grid-row', 'alert', alertOrientation)}>
      <div className={cx('grid-cols', 'alert-row')}>
        <div
          className={cx('alert-text', {
            animated: !update,
          })}
          onAnimationIteration={() => {
            updateAnimation();
            setTimeout(() => setUpdate(false), 100);
          }}
        >
          {alertElements}
        </div>
      </div>
    </div>
  );
};

export default MonitorAlertRow;
