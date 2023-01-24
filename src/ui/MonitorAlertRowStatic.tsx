import React, { FC, MutableRefObject, useEffect, useState } from 'react';
import cx from 'classnames';
import {
  getServiceAlertDescription,
  getServiceAlertHeader,
} from '../util/alertUtils';

interface IProps {
  alerts: any;
  languages: any;
  preview: boolean;
  alertRowReference: MutableRefObject<undefined>;
}

const MonitorAlertRowStatic: FC<IProps> = ({
  alerts,
  languages,
  alertRowReference,
}) => {
  const [current, setCurrent] = useState(0);
  const len = alerts.length * languages.length;
  useEffect(() => {
    const next = (current + 1) % len;
    const id = setTimeout(() => {
      setCurrent(next);
    }, 5000);
    return () => clearTimeout(id);
  }, [current]);

  const alert =
    getServiceAlertDescription(
      alerts[current % alerts.length],
      languages[current % languages.length],
    ) ||
    getServiceAlertHeader(
      alerts[current % alerts.length],
      languages[current % languages.length],
    );

  return (
    <div className={cx('grid-row', 'alert static')}>
      <div className={cx('grid-cols', 'alert-row')} ref={alertRowReference}>
        {alert}
      </div>
    </div>
  );
};

export default MonitorAlertRowStatic;
