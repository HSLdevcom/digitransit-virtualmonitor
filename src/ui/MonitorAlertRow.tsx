import React, { FC, useEffect, useState } from 'react';
import cx from 'classnames';

interface IProps {
  alerts: any;
  languages: any;
}
const getAnimationWidth = () => {
  const alertElements = document.getElementsByClassName('single-alert');
  const elementArray = alertElements;
  let animationWidth = 0; // = elementArray.forEach(i => console.log(i))
  for (let i = 0; i < elementArray.length; i++) {
    animationWidth += elementArray[i].clientWidth;
  }
  return animationWidth;
};

const MonitorAlertRow: FC<IProps> = ({ alerts, languages }) => {
  const [animationWidth, setAnimationWidth] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [update, setUpdate] = useState(false);

  const updateAnimation = () => {
    const width = getAnimationWidth();
    setAnimationWidth(width);
    setSpeed((width / window.innerWidth) * 5);
    setUpdate(true);
  };
  useEffect(() => {
    updateAnimation();
    const to = setTimeout(() => setUpdate(false), 100);
    window.addEventListener('resize', () => {
      updateAnimation();
      setTimeout(() => setUpdate(false), 100);
    });
    return () => clearTimeout(to);
  }, []);

  useEffect(() => {
    updateAnimation();
    const to = setTimeout(() => setUpdate(false), 100);
    return () => clearTimeout(to);
  }, [alerts]);

  const a = [];
  for (let i = 0; i < alerts.length; i++) {
    for (let j = 0; j < languages.length; j++) {
      a.push(
        <span className="single-alert">
          {
            alerts[i].alertDescriptionTextTranslations.find(
              a => a.language === languages[j],
            ).text
          }
        </span>,
      );
    }
  }
  const style = {
    '--animationWidth': `${Number(-1 * animationWidth).toFixed(0)}px`,
    '--speed': `${Number(speed).toFixed(0)}s`,
  } as React.CSSProperties;
  return (
    <div style={style} className={cx('grid-row', 'alert')}>
      <div className={cx('grid-cols', 'alert-row')}>
        <div
          className={cx('alert-text', {
            animated: !update,
          })}
        >
          {a}
        </div>
      </div>
    </div>
  );
};

export default MonitorAlertRow;
