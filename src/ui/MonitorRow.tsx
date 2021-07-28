import React, { FC } from 'react';
import { getDepartureTime } from '../time';
import cx from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ITranslation } from './TranslationContainer';
//import useFitText from "use-fit-text";

interface IRoute {
  alerts: any;
  shortName: string;
}

interface IStop {
  gtfsId: string;
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
  departure: IDeparture;
  currentLang: string;
  size: number;
  withSeparator: boolean;
  translations: Array<ITranslation>;
  isFirst?: boolean;
  isLandscape?: boolean;
  isOneLiner?: boolean;
  withTwoColumns?: boolean;
  dayForDivider?: string;
  alerts?: Array<IAlert>;
  alertRows?: number;
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
  size,
  withSeparator,
  currentLang,
  isFirst = false,
  isLandscape = true,
  isOneLiner = true,
  withTwoColumns = false,
  translations,
  dayForDivider,
  alerts,
  alertRows = 1,
  t,
}) => {
  //const translatedHeadsign = translations.find(t => t.translation === departure.headsign)
  const departureDestination =
    departure?.headsign && departure?.headsign.endsWith(' via')
      ? departure?.headsign.substring(0, departure?.headsign.indexOf(' via'))
      : departure?.headsign;

  const d = translations.find(
    t => t.trans_id === departureDestination?.split(' via')[0],
  );
  const destination = d ? d.translation : departureDestination;

  const splitDestination = destination && destination.includes(' via');

  let destinationWithoutVia = splitDestination
    ? destination.substring(0, destination.indexOf(' via'))
    : destination;
  let viaDestination = splitDestination
    ? destination.substring(destination.indexOf(' via') + 1)
    : '';

  if (departure?.pickupType === 'NONE') {
    const lastStop = departure?.trip?.stops.slice(-1).pop().gtfsId;
    if (departure.stop.gtfsId === lastStop) {
      destinationWithoutVia = t('endStopArrive');
      viaDestination = t('endStopTerminus');
      if (isLandscape) {
        destinationWithoutVia = destinationWithoutVia
          .concat('/')
          .concat(viaDestination);
        viaDestination = '';
      }
    }
  }

  if (isLandscape) {
    if (size != 4 && withTwoColumns) {
      viaDestination = '';
    }
    if (size == 8 && !withTwoColumns) {
      viaDestination = '';
    }
  }

  if (!isLandscape && size === 12) {
    viaDestination = '';
  }

  const line = processLine(departure?.trip?.route.shortName);

  if (departure === null && dayForDivider) {
    return (
      <div className={cx('grid-row day', { 'two-cols': withTwoColumns })}>
        <div className="day-row">{dayForDivider}</div>
      </div>
    );
  }
  if (alerts) {
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
  }

  const departureTime = getDepartureTime(departure?.realtimeDeparture);
  return (
    <>
      {withSeparator && (
        <div className={cx('separator', { first: isFirst })}></div>
      )}
      <div className={cx('grid-row', { 'two-cols': withTwoColumns })}>
        <div className="grid-col line">
          {line[0]}
          {line.length > 1 && <span className="line-letter">{line[1]}</span>}
        </div>
        {!isOneLiner && viaDestination.length === 0 && (
          <div className="grid-col destination">{destinationWithoutVia}</div>
        )}
        {!isOneLiner && viaDestination.length > 0 && (
          <div className="grid-col destination">
            {destinationWithoutVia}
            {/* <div
              className={cx(
                'via',
                isLandscape ? rowCount : '',
              )}
            >
              {viaDestination}
            </div> */}
          </div>
        )}
        {isOneLiner && !splitDestination && (
          <div className={cx('grid-col', 'destination')}>
            {destination &&
              !destination.includes(' via') &&
              destinationWithoutVia}
            {destination && destination.includes(' via') && (
              <>
                {destinationWithoutVia}
                <div className="via">{viaDestination}</div>
              </>
            )}
          </div>
        )}
        {isOneLiner && splitDestination && (
          <div className={cx('grid-col', 'destination-one-row')}>
            {destinationWithoutVia}
            {/* <div className="via">{viaDestination}</div> */}
          </div>
        )}
        <div className={cx('grid-col', 'time')}>
          <span
            className={cx('tilde', {
              show: departure?.realtime && departureTime !== null,
            })}
          >
            ~
          </span>
          {departureTime}
        </div>
      </div>
    </>
  );
};

export default withTranslation('translations')(MonitorRow);
