import React, { FC, useEffect, useState } from 'react';
import cx from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';

interface IAlertDescriptionTextTranslation {
  text: string;
  language?: string;
}
interface IAlert {
  alertDescriptionTextTranslations: Array<IAlertDescriptionTextTranslation>;
  alertHeaderTextTranslations: Array<IAlertDescriptionTextTranslation>;
  alertHeaderText: string;
  alertSeverityLevel: string;
}

interface IProps {
  isLandscape: boolean;
  alertRows: number;
  alerts: Array<IAlert>;
  currentLang: string;
}
const getAnimationHeight = () => {
  const alertContainer = document.getElementsByClassName('alert');
  const alert = document.getElementsByClassName('alert-text');
  return -1 * (alert[0]?.clientHeight - alertContainer[0]?.clientHeight);
}

const MonitorAlertRow: FC<IProps> = ({ alertRows, isLandscape, alerts, currentLang }) => {
  const [animationHeight, setAnimationHeight] = useState(0)
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    setAnimationHeight(getAnimationHeight())
    window.addEventListener('resize', () => {
      setAnimationHeight(getAnimationHeight())
      setUpdate(true);
      setTimeout(() => setUpdate(false), 100) // force keyframes to use the new value by rerendering
    })
  }, []);
  let alertRowClass = '';
  switch (alertRows) {
    case 2:
      alertRowClass = 'two-rows';
      break;
    case 3:
      alertRowClass = 'three-rows';
      break;
    case 4:
      alertRowClass = 'four-rows';
      break;
    default:
      alertRowClass = '';
      break;
  }
  const style = {
    '--animationHeight': `${Number(animationHeight).toFixed(0)}px`,
  } as React.CSSProperties;
  return (
    <div style={style} className={cx('grid-row', 'alert', alertRowClass)}>
      <div className={cx('grid-cols', 'alert-row')}>
        <div className={cx('alert-text', { animated: animationHeight < 0 && !update, portrait: !isLandscape })}>
          {
            alerts[0].alertDescriptionTextTranslations.find(
              a => a.language === currentLang,
            ).text
          }
        </div>
      </div>
    </div>
  );
};

export default MonitorAlertRow;
