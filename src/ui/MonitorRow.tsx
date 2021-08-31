import React, { FC } from 'react';
import { getDepartureTime } from '../time';
import cx from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ITranslation } from './TranslationContainer';
import Icon from './Icon';

interface IRoute {
  alerts: any;
  shortName: string;
}

interface IStop {
  gtfsId: string;
  code: string;
  platformCode: string;
  parentStation: any;
}
interface ITrip {
  route: IRoute;
  stops: Array<IStop>;
  gtfsId: string;
}
export interface IDeparture {
  realtimeState: string;
  serviceDay: number;
  trip: ITrip;
  route: any;
  headsign: string;
  realtimeDeparture: number;
  realtime: boolean;
  pickupType: string;
  stop: IStop;
}

interface IProps {
  isTwoRow: boolean;
  departure: IDeparture;
  translations: Array<ITranslation>;
  stops: Array<any>;
  isFirst?: boolean;
  showVia?: boolean;
  withTwoColumns?: boolean;
  alertState: number;
  dayForDivider?: string;
  currentLang: string;
  showMinutes: number;
}

const processLine = inputText => {
  const output = [];
  if (inputText) {
    const splittedText = inputText.split(' ');
    splittedText.forEach(item => {
      output.push(item.replace(/\\'/g, '').split(/(\d+)/).filter(Boolean));
    });
    return output[0];
  }
  return [''];
};

const MonitorRow: FC<IProps & WithTranslation> = ({
  departure,
  isFirst = false,
  showVia = true,
  withTwoColumns = false,
  alertState,
  isTwoRow,
  currentLang,
  stops,
  translations,
  dayForDivider,
  showMinutes,
  t,
}) => {
  const isCancelled = departure?.realtimeState === 'CANCELED';

  const departureDestination =
    departure?.headsign && departure?.headsign.endsWith(' via')
      ? departure?.headsign.substring(0, departure?.headsign.indexOf(' via'))
      : departure?.headsign;

  const d = translations.find(
    t => t.trans_id === departureDestination?.split(' via')[0],
  );
  let destination = d ? d.translation : departureDestination;

  const splitDestination =
    departureDestination && departureDestination.includes(' via');

  let viaDestination = splitDestination
    ? departureDestination.substring(departureDestination.indexOf(' via') + 1)
    : '';
  if (splitDestination) {
    const t = translations.find(
      t => t.trans_id === viaDestination.substring(4, viaDestination.length),
    )?.translation;
    if (t) {
      viaDestination = ` via ${t}`;
    }
  }
  if (departure?.pickupType === 'NONE') {
    const lastStop = departure?.trip?.stops.slice(-1).pop().gtfsId;
    if (departure.stop.gtfsId === lastStop) {
      destination = `${t('endStopArrive')}/${t('endStopTerminus')}`;
    }
  }

  const line = processLine(departure?.trip?.route.shortName);
  if (destination?.indexOf(' via') !== -1) {
    destination = destination?.substring(0, destination.indexOf(' via'));
  }
  if (departure === null && dayForDivider) {
    return (
      <div className="row-with-separator">
        <div className={cx('grid-row day', { 'two-cols': withTwoColumns })}>
          <div className="day-row">{dayForDivider}</div>
        </div>
      </div>
    );
  }

  const lineLen = departure?.trip?.route.shortName?.length;
  const stopCode = departure?.stop?.platformCode || departure?.stop?.code;
  const stopCodeLen = stopCode?.length;

  const departureTime = getDepartureTime(
    departure?.realtimeDeparture,
    showMinutes * 60,
    departure?.serviceDay,
  );
  const stopSettings = stops.find(s => {
    const gtfsID = departure?.stop?.parentStation
      ? departure?.stop.parentStation.gtfsId
      : departure?.stop.gtfsId;
    return s.gtfsId === gtfsID;
  });
  const showStopCode = stopSettings?.settings?.showStopNumber;

  return (
    <div className="row-with-separator">
      <div className={cx('separator', { first: isFirst })}></div>
      <div
        className={cx('grid-row', {
          'two-cols': withTwoColumns,
          'two-rows': isTwoRow,
          'with-stop-code': showStopCode,
          'is-cancelled': isCancelled,
        })}
      >
        <div className={cx('grid-col line', `len${lineLen}`)}>
          {line[0]}
          {line.length > 1 && <span className="line-letter">{line[1]}</span>}
        </div>
        <div className="grid-col destination">
          {alertState && isCancelled ? (
            isTwoRow ? (
              <>
                <div>{destination}</div>
                <div className="via-destination">
                  {isCancelled && <Icon img={'alert'} />}
                  {t('cancelled', { lng: currentLang })}
                </div>
              </>
            ) : (
              <>
                <Icon img={'alert'} />
                <div>{t('cancelled', { lng: currentLang })}</div>
              </>
            )
          ) : isTwoRow ? (
            <>
              <div>{destination}</div>
              <div className="via-destination">
                {isCancelled && <Icon img={'alert'} />}
                {viaDestination ||
                  (isCancelled && t('cancelled', { lng: currentLang }))}
              </div>
            </>
          ) : (
            <>
              {isCancelled && <Icon img={'alert'} />}
              <div>{destination}</div>
              {showVia && (
                <div className="via-destination">{viaDestination}</div>
              )}
            </>
          )}
        </div>
        {showStopCode && (
          <div className={cx('grid-col', `len${stopCodeLen}`)}>{stopCode}</div>
        )}
        <div className={cx('grid-col', 'time', `len${departureTime?.length}`)}>
          {departureTime?.length > 0 && !departure?.realtime && (
            <span className={cx('tilde')}>~</span>
          )}
          {departureTime}
        </div>
      </div>
    </div>
  );
};

export default withTranslation('translations')(MonitorRow);
