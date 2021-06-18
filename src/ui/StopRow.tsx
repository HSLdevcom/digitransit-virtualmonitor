import React, { FC, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import StopRoutesModal from './StopRoutesModal';
import StopCode from './StopCode';
import Icon from './Icon';
import { IStopInfo } from './StopInfoRetriever';
import './StopRow.scss';
import { getLayout } from '../util/getLayout';

interface IStopInfoPlus extends IStopInfo {
  cardId?: number;
  hiddenRoutes?: any;
  layout: number;
  locality?: string;
  patterns: Array<any>;
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
    stops: any,
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
  const saveHiddenRoutes = routes => {
    const newStop = {
      ...stop,
      hiddenRoutes: routes,
    };
    setStops(stop.cardId, side, newStop, false, stop.gtfsId);
    changeOpen(false);
  };
  const handleClick = () => {
    changeOpen(true);
  };

  return (
    <div className="stop-row-container">
      <div className="stop-row-stop icon">
        <Icon img="stop-bus" color={'#007ac9'} />
      </div>
      <div className="stop-row-main">
        <div className="stop-upper-row">
          {stop.name}
          <div className="hidden-routes" onClick={handleClick}>
            {t('hiddenRoutes')}
          </div>
        </div>
        {showModal && (
          <StopRoutesModal
            hiddenRoutes={stop.hiddenRoutes}
            closeModal={saveHiddenRoutes}
            showModal={showModal}
            stop={stop}
            routes={stop.patterns}
          />
        )}
        <div className="stop-bottom-row">
          {stop.desc && <div className="address">{stop.locality}</div>}
          <StopCode code={stop.code} />
          <div className="hidden-choices" role="button" onClick={handleClick}>
            {!stop.hiddenRoutes.length && t('hiddenNoChoices')}
            {stop.hiddenRoutes.length > 0 && (
              <span>
                {stop.hiddenRoutes.length
                  .toString()
                  .concat(' / ')
                  .concat(stop.patterns.length.toString())}
              </span>
            )}
          </div>
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
