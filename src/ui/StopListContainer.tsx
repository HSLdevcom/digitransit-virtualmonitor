import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IStop, ICardInfo } from '../util/Interfaces';
import StopListTitleInput from './StopListTitleInput';
import StopRow from './StopRow';
import { getLayout } from '../util/getResources';

interface Props {
  onStopDelete?: (cardId: number, side: string, gtfsId: string) => void;
  onStopMove?: (cardId: number, side: string, gtfsId: string) => void;
  setStops?: (
    cardId: number,
    side: string,
    stops: Array<IStop>,
    gtfsIdForHidden: string,
  ) => void;
  card: ICardInfo;
  updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
    lang?: string,
  ) => void;
  languages: Array<string>;
}

const StopListPlaceHolder = props => {
  const { text } = props;
  return (
    <ul className="stops">
      <li className="stop">
        <div className="stop-row-container placeholder">
          <div className="placeholder-no-stops">{text ? text : ''}</div>
        </div>
      </li>
    </ul>
  );
};

const StopListContainer: FC<Props> = ({
  card,
  onStopDelete,
  onStopMove,
  updateCardInfo,
  languages,
  setStops,
}) => {
  const [t] = useTranslation();
  const showStopTitles = getLayout(card.layout).isDoubleView;
  const leftItems = card.columns.left.stops;
  const rightItems = card.columns.right.stops;
  return (
    <div className="stop-list">
      <section
        id={`left-${card.id}`}
        aria-label={showStopTitles ? t('leftColumn') : undefined}
      >
        <div>
          {showStopTitles && (
            <div className="double-inputs">
              {languages?.map(lan => (
                <StopListTitleInput
                  key={`lan${lan}`}
                  lang={lan}
                  side={'left'}
                  updateCardInfo={updateCardInfo}
                  cardInfoId={card.id}
                  value={card.columns.left.title}
                />
              ))}
            </div>
          )}
          {showStopTitles && leftItems.length === 0 && (
            <StopListPlaceHolder text={t('no-stops-selected')} />
          )}
          <ul
            className="stops"
            aria-label={showStopTitles ? t('leftColumn') : t('added-stops')}
          >
            {leftItems &&
              leftItems.map((item, index) => {
                const s = {
                  ...item,
                  cardId: card.id,
                  layout: card.layout,
                };
                return (
                  <li key={`s-${index}`} className="stop">
                    <StopRow
                      stop={s}
                      side={'left'}
                      onStopDelete={onStopDelete}
                      onStopMove={onStopMove}
                      setStops={setStops}
                      languages={languages}
                    />
                  </li>
                );
              })}
          </ul>
        </div>
      </section>
      {showStopTitles && (
        <section id={`right-${card.id}`} aria-label={t('rightColumn')}>
          <div className="double-inputs">
            {languages?.map(lan => (
              <StopListTitleInput
                key={`lan${lan}`}
                lang={lan}
                side={'right'}
                updateCardInfo={updateCardInfo}
                cardInfoId={card.id}
                value={card.columns.right.title}
              />
            ))}
          </div>
          {showStopTitles && rightItems.length === 0 && (
            <StopListPlaceHolder text={t('no-stops-selected')} />
          )}
          <div>
            <ul className="stops" aria-label={t('rightColumn')}>
              {rightItems &&
                rightItems.map((item, index) => {
                  const s = {
                    ...item,
                    cardId: card.id,
                    layout: card.layout,
                  };
                  return (
                    <li className="stop" key={`s-${index}`}>
                      <StopRow
                        stop={s}
                        side={'right'}
                        onStopDelete={onStopDelete}
                        onStopMove={onStopMove}
                        setStops={setStops}
                        languages={languages}
                      />
                    </li>
                  );
                })}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
};

export default StopListContainer;
