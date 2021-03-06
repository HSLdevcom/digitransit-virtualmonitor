import cx from 'classnames';
import React, { FC, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IHiddenRoute, IPattern, ISettings } from '../util/Interfaces';
import StopRoutesModal from './StopRoutesModal';
import StopCode from './StopCode';
import Icon from './Icon';
import { IStopInfo } from './StopInfoRetriever';
import './StopRow.scss';
import { getLayout } from '../util/getLayout';

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
  const saveHiddenRoutes = settings => {
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
  return (
    <div className="stop-row-container">
      <div className="stop-row-stop icon">
        <Icon img="stop-bus" color={'#007ac9'} />
      </div>
      <div className="stop-row-main">
        <div className="stop-upper-row">
          {stop.name}
          <div className={cx('settings', isEastWest && 'east-west')}>
            <span onClick={handleClick}>
              {' '}
              <Icon img="settings" />
            </span>
          </div>
          <div
            className={cx(
              'hidden-routes',
              isEastWest && 'east-west',
              stop.settings?.timeShift > 0 &&
                stop.settings?.hiddenRoutes.length > 0
                ? 'clock-and-routes'
                : '',
            )}
          >
            {stop.settings?.timeShift > 0 && (
              <div className="clock">
                <Icon img="clock" width={14} height={14} />
                <span>
                  {' '}
                  {stop.settings.timeShift.toString().concat(' min')}{' '}
                </span>
              </div>
            )}
            {stop.settings?.hiddenRoutes.length > 0 && (
              <>
                {t('hiddenRoutes')}
                <span>
                  {stop.settings.hiddenRoutes.length
                    .toString()
                    .concat(' / ')
                    .concat(stop.patterns.length.toString())}
                </span>
              </>
            )}
          </div>
        </div>
        {showModal && (
          <StopRoutesModal
            hiddenRoutes={stop.settings}
            closeModal={saveHiddenRoutes}
            showModal={showModal}
            stop={stop}
            routes={stop.patterns}
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
      {getLayout(stop.layout)[2] && (
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
