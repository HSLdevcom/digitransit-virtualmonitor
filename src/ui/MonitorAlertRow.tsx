import React, { FC, useEffect, useState } from 'react';
import cx from 'classnames';
import { clear } from 'console';

interface IProps {
  alertCount: number;
  alerts: any;
  languages: any;
}
const getAnimationHeight = () => {
  const alertContainer = document.getElementsByClassName('alert');
  const alert = document.getElementsByClassName('alert-text');
  return -1 * (alert[0]?.scrollWidth - alertContainer[0]?.clientWidth);
};

const MonitorAlertRow: FC<IProps> = ({ alerts, alertCount, languages }) => {
  const [animationHeight, setAnimationHeight] = useState(0);
  const [curr, setCurr] = useState(0);
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    let to;
    window.addEventListener('resize', () => {
      setAnimationHeight(getAnimationHeight());
      to = setTimeout(() => setUpdate(false), 100);
    })
    return () => clearTimeout(to);
  }, [])
  useEffect(() => {
    setAnimationHeight(getAnimationHeight());
    setUpdate(true);
    const to = setTimeout(() => setUpdate(false), 100);
    return () => clearTimeout(to);
  }, [curr])
  useEffect(() => {
    setUpdate(true);
    const to = setTimeout(() => setUpdate(false), 100);
    return () => clearTimeout(to);
  }, [curr]);

  const a = alerts[
    Math.floor(curr / languages.length)
  ]?.alertDescriptionTextTranslations.find(
    a => a.language === languages[curr % languages.length],
  ).text;
  const style = {
    '--animationHeight': `${Number(animationHeight).toFixed(0)}px`,
  } as React.CSSProperties;
  return (
    <div style={style} className={cx('grid-row', 'alert')}>
      <div className={cx('grid-cols', 'alert-row')}>
        <div
          className={cx('alert-text', {
            animated: !update,
          })}
          onAnimationEnd={() => {setTimeout(() => setCurr((curr+1) % alertCount ), 2000)}}
        >
          {a}
        </div>
      </div>
    </div>
  );
};

export default MonitorAlertRow;
