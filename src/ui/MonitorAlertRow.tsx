import React, { FC, useEffect, useState } from 'react';
import cx from 'classnames';
import { clear } from 'console';

interface IProps {
  alertCount: number;
  alert: string;
}
const getAnimationHeight = () => {
  const alertContainer = document.getElementsByClassName('alert');
  const alert = document.getElementsByClassName('alert-text');
  return -1 * (alert[0]?.scrollWidth - alertContainer[0]?.clientWidth);
};

const MonitorAlertRow: FC<IProps> = ({ alert, alertCount }) => {
  const [animationHeight, setAnimationHeight] = useState(0);
  const [update, setUpdate] = useState(false);
  const [loop, setLoop] = useState(false);
  useEffect(() => {
    setAnimationHeight(getAnimationHeight());
    let to;
    window.addEventListener('resize', () => {
      setAnimationHeight(getAnimationHeight());
      setUpdate(true);
      to = setTimeout(() => setUpdate(false), 100); // force keyframes to use the new value by rerendering
    });
    return () => clearTimeout(to);
  }, []);
  useEffect(() => {
    let to1, to2;
    if (alertCount === 1) {
      setLoop(true);
      setUpdate(true);
      to1 = setTimeout(() => setUpdate(false), 100);
      to2 = setTimeout(() => setLoop(false), 20000);
    }
    return () => {
      clearTimeout(to1);
      clearTimeout(to2);
    };
  }, [alertCount, loop]);
  useEffect(() => {
    setAnimationHeight(getAnimationHeight());
    setUpdate(true);
    const to = setTimeout(() => setUpdate(false), 100);
    return () => clearTimeout(to);
  }, [alert]);

  const style = {
    '--animationHeight': `${Number(animationHeight).toFixed(0)}px`,
  } as React.CSSProperties;
  return (
    <div style={style} className={cx('grid-row', 'alert')}>
      <div className={cx('grid-cols', 'alert-row')}>
        <div
          className={cx('alert-text', {
            animated: animationHeight < 0 && !update,
          })}
        >
          {alert}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MonitorAlertRow);
