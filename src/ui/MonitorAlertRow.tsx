import React, { FC } from 'react';
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

const MonitorAlertRow: FC<IProps> = ({ alertRows, isLandscape, alerts, currentLang }) => {
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
  return (
    <div className={cx('grid-row', 'alert', alertRowClass)}>
      <div className={cx('grid-cols', 'alert-row')}>
        <span className={cx({ portrait: !isLandscape })}>
          {
            alerts[0].alertHeaderTextTranslations.find(
              a => a.language === currentLang,
            ).text
          }
        </span>
      </div>
    </div>
  );
};

export default MonitorAlertRow;
