import React, { FC, useContext } from 'react';
import { getDepartureTime } from '../time';
import cx from 'classnames';
import Icon from './Icon';
import { capitalize, getDepartureDestination } from '../util/monitorUtils';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from '../contexts';
import { getRenameDestinationId, trimMetroIcon } from '../util/headsignUtils';

interface IRoute {
  alerts: any;
  shortName: string;
  gtfsId?: string;
}

export interface IStop {
  gtfsId: string;
  code: string;
  platformCode: string;
  parentStation: any;
}
interface ITrip {
  tripHeadsign: string;
  tripHeadsignfi: string;
  tripHeadsignsv: string;
  tripHeadsignen: string;
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
  headsignfi: string;
  headsignsv: string;
  headsignen: string;
  realtimeDeparture: number;
  scheduledDeparture?: number;
  realtime: boolean;
  pickupType: string;
  stop: IStop;
  combinedPattern?: string;
  showStopNumber: boolean;
  showVia: boolean;
  renameID?: string;
  vehicleMode: string;
}

interface IProps {
  isTwoRow: boolean;
  departure: IDeparture;
  stops: Array<any>;
  isFirst?: boolean;
  showVia?: boolean;
  withTwoColumns?: boolean;
  alertState: number;
  dayForDivider?: string;
  currentLang: string;
  showMinutes: number;
  withoutRouteColumn: boolean;
  headsignfi?: string;
  headsignsv?: string;
  headsignen?: string;
}

const isCharacter = char => {
  return char.toLowerCase() !== char.toUpperCase();
};

const processLine = inputText => {
  if (inputText) {
    let index = 0;
    let letterFound = false;
    const splittedText = inputText.split('');
    while (!letterFound && index < splittedText.length) {
      if (isCharacter(splittedText[index])) {
        letterFound = true;
      } else {
        index++;
      }
    }
    if (letterFound && index > 0) {
      return [inputText.substring(0, index), inputText.substring(index)];
    } else {
      return [inputText];
    }
  }
  return [''];
};

const MonitorRow: FC<IProps> = ({
  departure,
  isFirst = false,
  showVia = true,
  withTwoColumns = false,
  alertState,
  isTwoRow,
  currentLang,
  stops,
  dayForDivider,
  showMinutes,
  withoutRouteColumn,
}) => {
  const config = useContext(ConfigContext);
  const [t] = useTranslation();
  if (departure === null && dayForDivider) {
    return (
      <div className="row-with-separator">
        <div className={cx('grid-row day', { 'two-cols': withTwoColumns })}>
          <div className="day-row">{dayForDivider}</div>
        </div>
      </div>
    );
  }

  if (!departure) {
    return (
      <div className="row-with-separator">
        <div className={cx('separator', { first: isFirst })}></div>
      </div>
    );
  }
  const renamedDestinations = [];
  stops.forEach(s =>
    s.settings?.renamedDestinations?.map(x => renamedDestinations.push(x)),
  );

  const isCancelled = departure.realtimeState === 'CANCELED';
  const departureDestination = getDepartureDestination(departure, currentLang);
  const renamedDestination = renamedDestinations.find(dest => {
    const renameDestId = trimMetroIcon(
      getRenameDestinationId(
        departure.renameID,
        departure.trip.route.gtfsId.toLowerCase(),
      ),
    );

    const metroDest =
      dest.pattern.toLowerCase().indexOf('(m)') > -1
        ? trimMetroIcon(dest.pattern)
        : null;
    const found = metroDest
      ? metroDest === renameDestId
      : dest.pattern.toLowerCase() === renameDestId;

    // Backwards combatibility
    if (!found) {
      return dest.pattern === departure.combinedPattern;
    }
    return found;
  });

  let destination = '';
  if (renamedDestination && renamedDestination[currentLang] !== '') {
    destination = renamedDestination[currentLang];
  } else {
    destination = capitalize(departureDestination);
  }

  const splitDestination =
    (renamedDestination &&
      renamedDestination[currentLang] !== '' &&
      renamedDestination[currentLang].includes(' via')) ||
    ((!renamedDestination || renamedDestination[currentLang] === '') &&
      departureDestination &&
      departureDestination.includes(' via'));

  let viaDestination = '';
  if (!renamedDestination || renamedDestination[currentLang] === '') {
    viaDestination = splitDestination
      ? departureDestination.substring(departureDestination.indexOf(' via') + 1)
      : '';
    if (splitDestination) {
      const t =
        departureDestination?.substring(
          departureDestination.indexOf(' via') + 1,
        ) === viaDestination
          ? departureDestination.split(' via ')
          : null;
      if (t) {
        viaDestination = ` via ${t[1]}`;
      }
    }
  } else if (renamedDestination && renamedDestination[currentLang] !== '') {
    viaDestination = splitDestination
      ? renamedDestination[currentLang].substring(
          renamedDestination[currentLang].indexOf(' via') + 1,
        )
      : '';
  }
  if (departure.pickupType === 'NONE') {
    const lastStop = departure.trip?.stops?.slice(-1).pop().gtfsId;
    if (departure.stop.gtfsId === lastStop) {
      destination = `${t('endStopArrive')}/${t('endStopTerminus')}`;
    }
  }

  const line = processLine(departure.trip?.route.shortName);
  if (destination?.indexOf(' via') !== -1) {
    destination = destination?.substring(0, destination.indexOf(' via'));
  }

  let replaceMetroStringWithIcon = false;
  let replaceViaMetroStringWithIcon = false;
  const metroStringIdx = destination ? destination.indexOf('(M)') : -1;
  const viaMetroStringIdx = viaDestination ? viaDestination.indexOf('(M)') : -1;
  if (metroStringIdx !== -1) {
    replaceMetroStringWithIcon = true;
    destination = destination.substring(0, metroStringIdx).trimEnd();
  }
  if (viaMetroStringIdx !== -1) {
    replaceViaMetroStringWithIcon = true;
    viaDestination = viaDestination.substring(0, viaMetroStringIdx).trimEnd();
  }

  let lineLen = departure.trip?.route.shortName?.length;
  const stopCode = departure.stop?.platformCode || departure.stop?.code;
  const stopCodeLen = stopCode?.length;
  const departureTime = getDepartureTime(
    departure.realtimeDeparture,
    showMinutes * 60,
    departure.serviceDay,
    config.useTilde,
    departure.realtime,
  );

  const showStopCode = departure.showStopNumber;
  const viaSetting = departure.showVia;
  if (!lineLen) {
    if (!departure) {
      lineLen = 0;
    } else {
      lineLen = -1;
    }
  }
  return (
    <div className="row-with-separator">
      <div className={cx('separator', { first: isFirst })}></div>
      <div
        className={cx('grid-row', {
          'two-cols': withTwoColumns,
          'two-rows': isTwoRow,
          'with-stop-code': showStopCode,
          'is-cancelled': isCancelled,
          'without-route-column': withoutRouteColumn,
        })}
      >
        {!withoutRouteColumn &&
          lineLen !== -1 &&
          lineLen <= config.lineCodeMaxLength && (
            <div className={cx('grid-col line', `len${lineLen}`)}>
              {line[0]}
              {line.length > 1 && (
                <span className="line-letter">{line[1]}</span>
              )}
            </div>
          )}
        {!withoutRouteColumn &&
          (lineLen === -1 || lineLen > config.lineCodeMaxLength) && (
            <div className={cx('grid-col line icon', `len${2}`)}>
              <Icon
                height={24}
                width={24}
                img={departure.vehicleMode || 'bus'}
                color={config.colors.monitorBackground}
              />
            </div>
          )}
        <div className="grid-col destination">
          {alertState && isCancelled ? (
            isTwoRow ? (
              <>
                <div className="destination-row">
                  {destination}
                  {replaceMetroStringWithIcon && (
                    <div className="metro-icon">
                      <Icon
                        img={'subway'}
                        height={16}
                        width={16}
                        color={config.modeIcons.colors['mode-subway']}
                      />
                    </div>
                  )}
                </div>
                <div className="via-destination">
                  {isCancelled && <Icon img={'alert'} />}
                  {t('cancelled', { lng: currentLang })}
                </div>
              </>
            ) : (
              <>
                <Icon img={'alert'} />
                <div className="cancelled-row">
                  {t('cancelled', { lng: currentLang })}
                </div>
              </>
            )
          ) : isTwoRow ? (
            <>
              <div className="destination-row">
                {destination}
                {replaceMetroStringWithIcon && (
                  <div className="metro-icon">
                    <Icon
                      img={'subway'}
                      height={16}
                      width={16}
                      color={config.modeIcons.colors['mode-subway']}
                    />
                  </div>
                )}
              </div>
              <div className="via-destination">
                {isCancelled && <Icon img={'alert'} />}
                {viaDestination ||
                  (isCancelled && t('cancelled', { lng: currentLang }))}
                {replaceViaMetroStringWithIcon && (
                  <div className="metro-icon-small">
                    <Icon
                      img={'subway'}
                      height={12}
                      width={12}
                      color={config.modeIcons.colors['mode-subway']}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {isCancelled && <Icon img={'alert'} />}
              <div className="destination-row">
                {destination}
                {replaceMetroStringWithIcon && (
                  <div className="metro-icon">
                    <Icon
                      img={'subway'}
                      height={16}
                      width={16}
                      color={config.modeIcons.colors['mode-subway']}
                    />
                  </div>
                )}
              </div>
              {showVia && viaSetting && (
                <>
                  <div className="via-destination">
                    {' '.concat(viaDestination)}
                    {replaceViaMetroStringWithIcon && (
                      <div className="metro-icon-small">
                        <Icon
                          img={'subway'}
                          height={12}
                          width={12}
                          color={config.modeIcons.colors['mode-subway']}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {showStopCode && (
          <div className={cx('grid-col code', `len${stopCodeLen}`)}>
            {stopCode}
          </div>
        )}
        <div className={cx('grid-col', 'time', `len${departureTime?.length}`)}>
          {!isCancelled &&
            departureTime?.length > 0 &&
            config.useTilde &&
            !departure.realtime && <span className={cx('tilde')}>~</span>}
          {departureTime}
        </div>
      </div>
    </div>
  );
};

export default MonitorRow;
