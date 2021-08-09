import React, { FC } from 'react';
import { getDepartureTime } from '../time';
import cx from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ITranslation } from './TranslationContainer';

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
}
export interface IDeparture {
  serviceDay: number;
  trip: ITrip;
  headsign: string;
  realtimeDeparture: number;
  realtime: boolean;
  pickupType: string;
  stop: IStop;
}

interface IProps {
  departure: IDeparture;
  translations: Array<ITranslation>;
  stops: Array<any>;
  isFirst?: boolean;
  showVia?: boolean;
  withTwoColumns?: boolean;
  dayForDivider?: string;
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
  stops,
  translations,
  dayForDivider,
  t,
}) => {
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

  if (departure === null && dayForDivider) {
    return (
      <div className={cx('grid-row day', { 'two-cols': withTwoColumns })}>
        <div className="day-row">{dayForDivider}</div>
      </div>
    );
  }

  const lineLen = departure?.trip?.route.shortName.length;
  const stopCode = departure?.stop?.platformCode || departure?.stop?.code;
  const stopCodeLen = stopCode?.length;

  const departureTime = getDepartureTime(departure?.realtimeDeparture, 600);
  const stopSettings = stops.find(s => {
    const gtfsID = departure?.stop?.parentStation
      ? departure?.stop.parentStation.gtfsId
      : departure?.stop.gtfsId;
    return s.gtfsId === gtfsID;
  });
  const showStopCode = stopSettings?.settings?.showStopNumber;
  return (
    <>
      <div className={cx('separator', { first: isFirst })}></div>
      <div
        className={cx('grid-row', {
          'two-cols': withTwoColumns,
          'with-stop-code': showStopCode,
        })}
      >
        <div className={cx('grid-col line', `len${lineLen}`)}>
          {line[0]}
          {line.length > 1 && <span className="line-letter">{line[1]}</span>}
        </div>
        <div className="grid-col destination">
          <div>{destination}</div>
          {showVia && <div className="via-destination">{viaDestination}</div>}
        </div>
        {showStopCode && (
          <div className={cx('grid-col', `len${stopCodeLen}`)}>{stopCode}</div>
        )}
        <div className={cx('grid-col', 'time', `len${departureTime?.length}`)}>
          {departure?.realtime && departureTime !== null && (
            <span className={cx('tilde')}>~</span>
          )}
          {departureTime}
        </div>
      </div>
    </>
  );
};

export default withTranslation('translations')(MonitorRow);
