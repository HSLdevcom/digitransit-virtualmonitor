import cx from 'classnames';
import React, { FC, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IPattern, ISettings } from '../util/Interfaces';
import StopRoutesModal from './StopRoutesModal';
import StopCode from './StopCode';
import Icon from './Icon';
import { IStopInfo } from './StopInfoRetriever';
import { getLayout } from '../util/getLayout';
import { sortBy, uniqWith, isEqual } from 'lodash';
import { stringifyPattern } from '../util/monitorUtils';
import { defaultSettings } from './StopRoutesModal';
import { getPrimaryColor, getIconStyleWithColor } from '../util/getConfig';
import { getStopIcon } from '../util/stopCardUtil';

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

  const isDefaultSettings =
    isEqual(defaultSettings, stop.settings) || !stop.settings;

  const iconStyle = getIconStyleWithColor(getStopIcon(stop));
  return (
    <div className="stop-row-container">
      <div className="stop-row-stop icon">
        <Icon
          img={
            !iconStyle.postfix
              ? getStopIcon(stop)
              : getStopIcon(stop) + iconStyle.postfix
          }
          width={32}
          height={32}
          color={iconStyle.color}
        />
      </div>
      <div className="stop-row-main">
        <div className="stop-upper-row">
          {stop.name}
          <div className={cx('settings', isEastWest && 'east-west')}>
            <span onClick={handleClick}>
              <Icon img="settings" color={getPrimaryColor()} />
            </span>
          </div>
          <div className={cx('changed-settings', isEastWest && 'east-west')}>
            {!isDefaultSettings && <span> {t('settingsChanged')}</span>}
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
        <Icon img="delete" color={getPrimaryColor()} />
      </div>
      {getLayout(stop.layout).isMultiDisplay && (
        <div
          className="stop-row-move icon"
          onClick={() => onStopMove(stop.cardId, side, stop.gtfsId)}
        >
          <Icon
            img={side === 'left' ? 'move-both-down' : 'move-both-up'}
            color={getPrimaryColor()}
            width={30}
            height={40}
          />
        </div>
      )}
    </div>
  );
};

export default withTranslation('translations')(StopRow);
