import React, { FC, useState } from 'react';
import StopCardRow from './StopCardRow';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { v4 as uuid } from 'uuid';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ICardInfo } from './CardInfo';

const SortableStopCardItem = SortableElement(({ value: item, possibleToDrag }) => {
  const cardInfo: ICardInfo = {
    id: item.id,
    title: item.title,
    layout: item.layout,
    duration: item.duration,
    possibleToDrag: possibleToDrag,
  };
  return (
    <li className="stopcard" id={`stopcard_${cardInfo.id}`}>
      <StopCardRow
        cardInfo={cardInfo}
        stops={item.stops}
        onCardDelete={item.onCardDelete}
        setStops={item.setStops}
        onStopDelete={item.onStopDelete}
        updateCardInfo={item.updateCardInfo}
      />
    </li>
  );
});

const SortableStopCardList = SortableContainer(({ items }) => {
  return (
    <ul className="stopcards">
      {items.map((item, index) => {
        return <SortableStopCardItem key={uuid()} index={index} value={item} possibleToDrag={items.length > 1} />;
      })}
    </ul>
  );
});

const defaultStopCard = t => ({
  id: 1,
  title: t('viewEditorName'),
  stops: {
    left: {
      inUse: true,
      title: t('sideLeft'),
      items: [],
    },
    right: {
      inUse: false,
      title: t('sideRight'),
      items: [],
    },
  },
  layout: 2,
  duration: 5,
});

const StopCardListContainer: FC<WithTranslation> = ({ t }) => {
  const [stopCardList, setStopCardList] = useState([defaultStopCard(t)]);

  const onCardDelete = (id: number) => {
    setStopCardList(stopCardList.filter(s => s.id !== id));
  };

  const onStopDelete = (cardId: number, side: string, gtfsId: string) => {
    const cardIndex = stopCardList.findIndex(card => card.id === cardId);
    stopCardList[cardIndex].stops[side].items = stopCardList[cardIndex].stops[
      side
    ].items.filter(stop => stop.gtfsId !== gtfsId);
    setStopCardList(stopCardList.slice());
  };

  const setStops = (
    cardId: number,
    side: string,
    stops: any,
    reorder: boolean,
    gtfsIdForHidden: string,
  ) => {
    const cardIndex = stopCardList.findIndex(card => card.id === cardId);
    if (!gtfsIdForHidden) {
      stopCardList[cardIndex].stops[side].items = reorder
        ? stops
        : stopCardList[cardIndex].stops[side].items.concat(stops);
      setStopCardList(stopCardList.slice());
    } else {
      const stopIndex = stopCardList[cardIndex].stops[side].items.findIndex(
        stop => stop.gtfsId === gtfsIdForHidden,
      );
      stopCardList[cardIndex].stops[side].items[stopIndex] = stops;
      setStopCardList(stopCardList.slice());
    }
  };

  const updateCardInfo = (cardId: number, type: string, value: string) => {
    const cardIndex = stopCardList.findIndex(card => card.id === cardId);
    if (type === 'title') {
      stopCardList[cardIndex].title = value;
    } else if (type === 'title-left') {
      stopCardList[cardIndex].stops['left'].title = value;
    } else if (type === 'title-right') {
      stopCardList[cardIndex].stops['right'].title = value;
      stopCardList[cardIndex].stops['right'].inUse = true;
    } else if (type === 'layout') {
      stopCardList[cardIndex].layout = Number(value);
    } else if (type === 'duration') {
      stopCardList[cardIndex].duration = Number(value);
    }
    setStopCardList(stopCardList.slice());
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setStopCardList(arrayMove(stopCardList, oldIndex, newIndex));
  };

  const onSortStart = ({ index, node }) => {
    const card = stopCardList[index];
    //stopcard/stopcard-row-container/title-with-icons/stop-title/stop-title-input-container/stop-title-input
    const input = node.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      .childNodes[0] as HTMLInputElement;
    if (card.title !== input.value) {
      updateCardInfo(stopCardList[index].id, 'title', input.value);
    }
  };

  const addNew = () => {
    let cnt = stopCardList.length + 1;
    while (cnt > 0) {
      if (stopCardList.filter(s => s.id === cnt).length === 0) {
        const newCard = {
          ...defaultStopCard(t),
          id: cnt,
        };
        setStopCardList(stopCardList.concat(newCard));
        cnt = 0;
      }
      cnt--;
    }
  };

  const modifiedStopCardList = stopCardList.map(card => {
    return {
      ...card,
      onCardDelete: onCardDelete,
      onStopDelete: onStopDelete,
      setStops: setStops,
      updateCardInfo: updateCardInfo,
    };
  });

  return (
    <>
      <SortableStopCardList
        items={modifiedStopCardList}
        useDragHandle
        onSortEnd={onSortEnd}
        onSortStart={onSortStart}
      />
      <button onClick={addNew}>{t('prepareDisplay')}</button>
      <button>{t('previewView')} - ei tee mitään</button>
      <button>{t('displayEditorStaticLink')} - ei tee mitään</button>
    </>
  );
};

export default withTranslation('translations')(StopCardListContainer);
