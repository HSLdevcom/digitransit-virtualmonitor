import cx from 'classnames';
import React, { FC, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IPattern, ISettings } from '../util/Interfaces';
import StopRoutesModal from './StopRoutesModal';
import StopCode from './StopCode';
import Icon from './Icon';
import { IStopInfo } from './StopInfoRetriever';
import { getLayout } from '../util/getLayout';
import { sortBy, uniqWith } from 'lodash';
import { stringifyPattern } from '../util/monitorUtils';

interface IStopInfoPlus extends IStopInfo {
  cardId?: number;
  settings?: ISettings;
  layout: number;
  locality?: string;
  patterns: Array<IPattern>;
}

interface IProps {
  readonly side: string;
  readonly stop: IStopInfoPlus;
  readonly stopId?: string;
  readonly onStopDelete: (cardId: number, side: string, gtfsId: string) => void;
  readonly onStopMove: (cardId: number, side: string, gtfsId: string) => void;
  readonly setStops?: (
    cardId: number,
    side: string,
    stops: IStopInfoPlus,
    reorder: boolean,
    gtfsIdForHidden: string,
  ) => void;
}
const getStopIcon = stop => {
  return stop.locationType === 'STATION' && stop.vehicleMode
    ? stop.vehicleMode?.toLowerCase()
    : 'stop-bus';
};

const StopRow: FC<IProps & WithTranslation> = ({
  side,
  stop,
  onStopDelete,
  onStopMove,
  setStops,
  t,
}) => {
  const [showModal, changeOpen] = useState(false);
  const saveStopSettings = settings => {
    console.log(stop)
    const newStop = {
      ...stop,
      settings: settings,
    };
    setStops(stop.cardId, side, newStop, false, stop.gtfsId);
    changeOpen(false);
  };
  const handleClick = () => {
    changeOpen(true);
  };
  const isEastWest = stop.layout > 8 && stop.layout < 12;

  const stopPatterns = sortBy(stop.patterns, 'route.shortName').map(pattern => {
    return stringifyPattern(pattern);
  });

  const combinedPatterns = uniqWith(stopPatterns);

  let settingsClassName = '';
  if (
    stop.settings?.timeShift > 0 &&
    stop.settings?.hiddenRoutes.length > 0 &&
    stop.settings?.renamedDestinations.length === 0
  ) {
    settingsClassName = 'clock-and-routes';
  } else if (
    stop.settings?.timeShift > 0 &&
    stop.settings?.hiddenRoutes.length === 0 &&
    stop.settings?.renamedDestinations.length > 0
  ) {
    settingsClassName = 'clock-and-renamed-destinations';
  } else if (
    stop.settings?.timeShift === 0 &&
    stop.settings?.hiddenRoutes.length > 0 &&
    stop.settings?.renamedDestinations.length > 0
  ) {
    settingsClassName = 'routes-and-renamed-destinations';
  } else if (
    stop.settings?.timeShift > 0 &&
    stop.settings?.hiddenRoutes.length > 0 &&
    stop.settings?.renamedDestinations.length > 0
  ) {
    settingsClassName = 'all';
  }

  return (
    <div className="stop-row-container">
      <div className="stop-row-stop icon">
        <Icon
          img={getStopIcon(stop)}
          color={'#007ac9'}
          height={32}
          width={32}
        />
      </div>
      <div className="stop-row-main">
        <div className="stop-upper-row">
          {stop.name}
          <div className={cx('settings', isEastWest && 'east-west')}>
            <span onClick={handleClick}>
              <Icon img="settings" />
            </span>
          </div>
          <div
            className={cx(
              'changed-settings',
              isEastWest && 'east-west',
              settingsClassName,
            )}
          >
            {stop.settings?.timeShift > 0 && (
              <div className="clock">
                <Icon img="clock" width={14} height={14} />
                <span>{stop.settings.timeShift.toString().concat(' min')}</span>
              </div>
            )}
            {stop.settings?.hiddenRoutes.length > 0 && (
              <>
                {t('hiddenRoutes')}
                <span>
                  {stop.settings.hiddenRoutes.length
                    .toString()
                    .concat(' / ')
                    .concat(combinedPatterns.length.toString())}
                </span>
              </>
            )}
            {stop.settings?.renamedDestinations.length > 0 && (
              <div
                className={
                  settingsClassName === 'all' ? 'changed-destinations' : ''
                }
              >
                {t('renamedDestinations')}
                <span>
                  {stop.settings.renamedDestinations.length
                    .toString()
                    .concat(' / ')
                    .concat(combinedPatterns.length.toString())}
                </span>
              </div>
            )}
          </div>
        </div>
        {showModal && (
          <StopRoutesModal
            stopSettings={stop.settings}
            closeModal={saveStopSettings}
            showModal={showModal}
            stop={stop}
            combinedPatterns={combinedPatterns}
          />
        )}
        <div className="stop-bottom-row">
          {stop.locality && <div className="address">{stop.locality}</div>}
          <StopCode code={stop.code} />
        </div>
      </div>
      <div
        className="stop-row-delete icon"
        onClick={() => onStopDelete(stop.cardId, side, stop.gtfsId)}
      >
        <Icon img="delete" color={'#007AC9'} />
      </div>
      {getLayout(stop.layout).isMultiDisplay && (
        <div
          className="stop-row-move icon"
          onClick={() => onStopMove(stop.cardId, side, stop.gtfsId)}
        >
          <Icon
            img={side === 'left' ? 'move-both-down' : 'move-both-up'}
            color={'#007AC9'}
            width={30}
            height={40}
          />
        </div>
      )}
    </div>
  );
};

export default withTranslation('translations')(StopRow);
