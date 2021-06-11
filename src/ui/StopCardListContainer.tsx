import React, { FC, useState } from 'react';
import StopCardRow from './StopCardRow';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { v4 as uuid } from 'uuid';
import hash from 'object-hash';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ICardInfo } from './CardInfo';

const SortableStopCardItem = SortableElement(({ value: item }) => {
  const cardInfo: ICardInfo = { id: item.id, title: item.title, layout: item.layout, time: item.time };
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
        return <SortableStopCardItem key={uuid()} index={index} value={item} />;
      })}
    </ul>
  );
});

const StopCardListContainer: FC<WithTranslation> = ({ t }) => {
  const defaultStopCard = {
    id: 1,
    title: t('viewEditorName'),
    stops: {
      left: {
        title: t('sideLeft'),
        items: [],
      },
      right: {
        title: t('sideRight'),
        items: [],
      },
    },
    layout: 2,
    time: 5,
  };
  //const defaultStopCard = { id: 1, title: t('viewEditorName'), stops: [], layout: 2, time: 5 };
  const [stopCardList, setStopCardList] = useState([defaultStopCard]);

  const onCardDelete = (id: number) => {
    setStopCardList(stopCardList.filter(s => s.id !== id));
  };
  
  console.log('hash:', hash(stopCardList));

  const onStopDelete = (cardId: number, side: string, gtfsId: string) => {
    const card = stopCardList.find(card => card.id === cardId);
    card.stops[side].items = card.stops[side].items.filter(stop => stop.gtfsId !== gtfsId);
    const array = stopCardList.slice();
    const index = stopCardList.indexOf(card);
    array[index] = card;
    setStopCardList(array);
  };

  /*const onStopDelete = (cardId: number, gtfsId: string) => {
    const card = stopCardList.find(card => card.id === cardId);
    card.stops = card.stops.filter(stop => stop.gtfsId !== gtfsId);
    const array = stopCardList.slice();
    const index = stopCardList.indexOf(card);
    array[index] = card;
    setStopCardList(array);
  };*/

  const setStops = (cardId: number, side: string, stops: any, reorder: boolean, gtfsIdForHidden: string) => {
    const card = stopCardList.find(card => card.id === cardId);
    if (!gtfsIdForHidden) {
      card.stops[side].items = reorder ? stops : card.stops[side].items.concat(stops);
    } else {
      const stopToUpdate = card.stops[side].items.find(stop => stop.gtfsId === gtfsIdForHidden);
      const stopArray = card.stops[side].items.slice();
      const stopIndex = card.stops[side].items.indexOf(stopToUpdate);
      stopArray[stopIndex] = stops;
      card.stops[side].items = stopArray;
    }
    const array = stopCardList.slice();
    const index = stopCardList.indexOf(card);
    array[index] = card;
    setStopCardList(array);
  };

  const updateCardInfo = (cardId: number, type: string, value: string) => {
    const card = stopCardList.find(card => card.id === cardId);
    if (type === 'title') {
      card.title = value;
    } else if (type === 'title-left') {
      card.stops['left'].title = value;
    } else if (type === 'title-right') {
      card.stops['right'].title = value;
    } else if (type === 'layout') {
      card.layout = Number(value);
    } else if (type === 'time') {
      card.time = Number(value);
    }
    const array = stopCardList.slice();
    const index = stopCardList.indexOf(card);
    array[index] = card;
    setStopCardList(array);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setStopCardList(arrayMove(stopCardList, oldIndex, newIndex));
  };

  const onSortStart = ({ index, node }) => {
    const card = stopCardList[index];
    const input = node.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0] as HTMLInputElement;
    if (card.title !== input.value) {
      updateCardInfo(stopCardList[index].id, 'title', input.value);
    }
  };

  const addNew = () => {
    let cnt = stopCardList.length + 1;
    while (cnt > 0) {
      if (stopCardList.filter(s => s.id === cnt).length === 0) {
        const newCard = {
          ...defaultStopCard,
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
