import React, { FC, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import {
  getServiceAlertDescription,
  getServiceAlertHeader,
} from '../util/alertUtils';
import { IAlert } from '../util/Interfaces';
import { SupportedLanguage } from '../i18n';

interface IProps {
  alerts: Array<IAlert>;
  languages: Array<SupportedLanguage>;
  preview: boolean;
  alertOrientation: string;
}
const getAnimationWidth = orientation => {
  const alertElements = document.getElementsByClassName('single-alert');
  let animationWidth = 0;
  for (let i = 0; i < alertElements.length; i++) {
    if (orientation === 'vertical') {
      animationWidth += alertElements[i].clientHeight + 10;
    } else {
      animationWidth += alertElements[i].clientWidth;
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
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateAnimation = () => {
    const width = getAnimationWidth(alertOrientation);
    const windowWidth = preview ? 640 : window.innerWidth;
    const windowHeight = preview ? 370 : window.innerWidth;
    setAnimationWidth(width);
    alertOrientation === 'horizontal'
      ? setSpeed((width / windowWidth) * 8) // 10 means that it should take 10 seconds for a word appearing from the right to reach the left side of the screen
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
    const handleResize = () => {
      updateAnimation();
      if (resizeTimeoutRef.current !== null) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => setUpdate(false), 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current !== null) {
        clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
    };
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
            requestAnimationFrame(() => setUpdate(false));
          }}
        >
          {alertElements}
        </div>
      </div>
    </div>
  );
};

export default MonitorAlertRow;
