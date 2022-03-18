import cx from 'classnames';
import React, { FC, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IPattern, ISettings } from '../util/Interfaces';
import StopRoutesModal from './StopRoutesModal';
import StopCode from './StopCode';
import Icon from './Icon';
import { IStop } from '../util/Interfaces';
import { getLayout } from '../util/getLayout';
import { sortBy, uniqWith, isEqual } from 'lodash';
import { stringifyPattern } from '../util/monitorUtils';
import { defaultSettings } from './StopRoutesModal';
import { getPrimaryColor, getIconStyleWithColor } from '../util/getConfig';
import { getStopIcon } from '../util/stopCardUtil';
import { isKeyboardSelectionEvent } from '../util/browser';

interface IStopInfoPlus extends IStop {
  cardId?: number;
  settings: ISettings;
  layout: number;
  locality?: string;
  patterns: Array<IPattern>;
  id?: string;
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
  readonly leftStops?: Array<IStopInfoPlus>;
  readonly rightStops?: Array<IStopInfoPlus>;
  readonly languages: Array<string>;
}

const moveIsPossible = (stop, stopList) => {
  if (stopList.some((s: IStopInfoPlus) => s.id === stop.id)) {
    return false;
  }
  return true;
};

const StopRow: FC<IProps & WithTranslation> = ({
  side,
  stop,
  onStopDelete,
  onStopMove,
  setStops,
  t,
  leftStops,
  rightStops,
  languages,
}) => {
  const [showModal, changeOpen] = useState(false);
  const saveStopSettings = settings => {
    if (settings) {
      const newStop = {
        ...stop,
        settings: settings,
      };
      setStops(stop.cardId, side, newStop, false, stop.gtfsId);
    }
    changeOpen(false);
  };
  const handleClick = (
    event?: React.KeyboardEvent<HTMLDivElement>,
    role?: boolean,
  ) => {
    if (event == null || isKeyboardSelectionEvent(event, role)) {
      changeOpen(true);
    }
  };
  const isEastWest = stop.layout > 8 && stop.layout < 12;

  const stopPatterns = sortBy(stop.patterns, 'route.shortName').map(pattern => {
    return stringifyPattern(pattern);
  });

  const combinedPatterns = uniqWith(stopPatterns);

  const isDefaultSettings =
    isEqual(defaultSettings, stop.settings) || !stop.settings;

  const iconStyle = getIconStyleWithColor(getStopIcon(stop));

  const moveBetweenColumns = getLayout(stop.layout).isMultiDisplay
    ? moveIsPossible(stop, side === 'left' ? rightStops : leftStops)
    : false;

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
          <div
            className={cx('settings', isEastWest && 'east-west')}
            tabIndex={0}
            role="button"
            aria-label={t('stopSettings', {
              stop: `${stop.name} ${stop.code}`,
            })}
            onClick={() => handleClick()}
            onKeyPress={e =>
              isKeyboardSelectionEvent(e, true) && handleClick(e, true)
            }
          >
            <Icon img="settings" color={getPrimaryColor()} />
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
            languages={languages}
          />
        )}
        <div className="stop-bottom-row">
          {stop.locality && <div className="address">{stop.locality}</div>}
          <StopCode code={stop.code} />
        </div>
      </div>
      <div
        className="stop-row-delete icon"
        tabIndex={0}
        role="button"
        aria-label={t('deleteStop', { stop: `${stop.name} ${stop.code}` })}
        onClick={() => onStopDelete(stop.cardId, side, stop.gtfsId)}
        onKeyPress={e =>
          isKeyboardSelectionEvent(e, true) &&
          onStopDelete(stop.cardId, side, stop.gtfsId)
        }
      >
        <Icon img="delete" color={getPrimaryColor()} />
      </div>
      {getLayout(stop.layout).isMultiDisplay && (
        <div
          className="stop-row-move icon"
          tabIndex={0}
          role="button"
          aria-label={t(
            side === 'left' ? 'moveStopToRightCol' : 'moveStopToLeftCol',
            { stop: `${stop.name} ${stop.code}` },
          )}
          onClick={() =>
            moveBetweenColumns
              ? onStopMove(stop.cardId, side, stop.gtfsId)
              : null
          }
          onKeyPress={e =>
            moveBetweenColumns
              ? isKeyboardSelectionEvent(e, true) &&
                onStopMove(stop.cardId, side, stop.gtfsId)
              : null
          }
        >
          <Icon
            img={side === 'left' ? 'move-both-down' : 'move-both-up'}
            color={moveBetweenColumns ? getPrimaryColor() : '#AAAAAA'}
            width={30}
            height={40}
          />
        </div>
      )}
    </div>
  );
};

export default withTranslation('translations')(StopRow);
