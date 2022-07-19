import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IStop, ICardInfo } from '../util/Interfaces';
import StopListTitleInput from './StopListTitleInput';
import StopRow from './StopRow';
import { v4 as uuid } from 'uuid';
import { getLayout } from '../util/getLayout';

interface Props {
  onStopDelete?: (cardId: number, side: string, gtfsId: string) => void;
  onStopMove?: (cardId: number, side: string, gtfsId: string) => void;
  setStops?: (
    cardId: number,
    side: string,
    stops: Array<IStop>,
    reorder: boolean,
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

const TitleItem = props => {
  const [titleLeft, setTitleLeft] = useState('');
  const [changedLeft, setChangedLeft] = useState(false);
  const [titleRight, setTitleRight] = useState('');
  const [changedRight, setChangedRight] = useState(false);
  const { cardInfo, side, updateCardInfo, leftItemsHeader, rightItemsHeader } =
    props;

  const setTitle = (
    side: string,
    changed: boolean,
    title: string = undefined,
  ) => {
    if (title) {
      side === 'left' ? setTitleLeft(title) : setTitleRight(title);
    }
    side === 'left' ? setChangedLeft(changed) : setChangedRight(changed);
  };

  const valueLeft = changedLeft ? titleLeft : props.titleLeft;
  const valueRight = changedRight ? titleRight : props.titleRight;
  return (
    <div className="east-west-inputs">
      {props.languages?.map(lan => (
        <StopListTitleInput
          key={`lan${lan}`}
          lang={lan}
          side={side}
          titleLeft={titleLeft}
          titleRight={titleRight}
          updateCardInfo={updateCardInfo}
          cardInfoId={cardInfo.id}
          setTitle={setTitle}
          itemsHeader={side == 'left' ? leftItemsHeader : rightItemsHeader}
          value={side === 'left' ? valueLeft : valueRight}
        />
      ))}
    </div>
  );
};

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

const StopList = props => {
  const {
    leftItems,
    leftTitle,
    rightTitle,
    rightItems,
    leftItemsPlaceHolder,
    rightItemsPlaceHolder,
    leftItemsHeader,
    rightItemsHeader,
    cardInfo,
    updateCardInfo,
    languages,
  } = props;

  const showStopTitles = getLayout(cardInfo.layout).isMultiDisplay;

  return (
    <>
      <section id={'left'}>
        <div>
          {showStopTitles && (
            <TitleItem
              side="left"
              titleLeft={leftTitle}
              leftItemsHeader={leftItemsHeader}
              cardInfo={cardInfo}
              updateCardInfo={updateCardInfo}
              languages={languages}
            />
          )}
          {showStopTitles && leftItems.length === 0 && (
            <StopListPlaceHolder text={leftItemsPlaceHolder} />
          )}
          <ul className="stops">
            {leftItems &&
              leftItems.map((item, index) => {
                return (
                  <li key={`s-${index}`} className="stop">
                    <StopRow
                      key={uuid()}
                      stop={item}
                      side={'left'}
                      onStopDelete={props.onStopDelete}
                      onStopMove={props.onStopMove}
                      setStops={props.setStops}
                      rightStops={rightItems}
                      languages={languages}
                    />
                  </li>
                );
              })}
          </ul>
        </div>
      </section>
      {showStopTitles && (
        <section id={'right'}>
          <TitleItem
            side="right"
            titleRight={rightTitle}
            rightItemsHeader={rightItemsHeader}
            cardInfo={cardInfo}
            updateCardInfo={updateCardInfo}
            languages={languages}
          />
          {showStopTitles && rightItems.length === 0 && (
            <StopListPlaceHolder text={rightItemsPlaceHolder} />
          )}
          <div>
            <ul className="stops">
              {rightItems &&
                rightItems.map(item => {
                  return (
                    <li className="stop" key={uuid()}>
                      <StopRow
                        key={uuid()}
                        stop={item}
                        side={'right'}
                        onStopDelete={props.onStopDelete}
                        onStopMove={props.onStopMove}
                        setStops={props.setStops}
                        leftStops={leftItems}
                        languages={languages}
                      />
                    </li>
                  );
                })}
            </ul>
          </div>
        </section>
      )}
    </>
  );
};

const addInfoToItems = (card, items, side) => {
  const modifiedItems =
    items.length > 0
      ? items.map(item => ({
          ...item,
          side: side,
          cardId: card.id,
          layout: card.layout,
        }))
      : [];
  return modifiedItems;
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
  const leftItems = card.columns.left.stops;
  const rightItems = card.columns.right.stops;

  return (
    <div className="stop-list">
      <StopList
        leftItems={addInfoToItems(card, leftItems, 'left')}
        leftItemsHeader={t('headerSideLeft')}
        leftItemsPlaceHolder={t('placeholderSideLeft')}
        leftTitle={card.columns.left.title}
        leftStops={leftItems}
        rightItems={addInfoToItems(card, rightItems, 'right')}
        rightItemsHeader={t('headerSideRight')}
        rightItemsPlaceHolder={t('placeholderSideRight', {
          title: card.columns.left.title,
        })}
        rightTitle={card.columns.right.title}
        rightStops={rightItems}
        onStopDelete={onStopDelete}
        onStopMove={onStopMove}
        setStops={setStops}
        cardInfo={card}
        updateCardInfo={updateCardInfo}
        languages={languages}
      />
    </div>
  );
};

export default StopListContainer;
