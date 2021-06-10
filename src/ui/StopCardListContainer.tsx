import React, { FC, useState } from 'react';
import StopCardRow from './StopCardRow';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { v4 as uuid } from 'uuid';
import hash from 'object-hash';

interface Props {
  //stopCards: any,
  //onDelete: Function,
}

const stopCardsArray = [
  { id: 1, title: 'Näkymä1', stops: [] },
  { id: 2, title: 'Näkymä2', stops: [] },
  { id: 3, title: 'Näkymä3', stops: [] },
];

const SortableStopCardItem = SortableElement(({ value }) => {
  return (
    <li className="stopcard">
      <StopCardRow
        id={value.id}
        title={value.title}
        stops={value.stops}
        onCardDelete={value.onCardDelete}
        setStops={value.setStops}
        onStopDelete={value.onStopDelete}
        updateTitle={value.updateTitle}
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

const StopCardListContainer: FC<Props> = props => {
  const [stopCardList, setStopCardList] = useState(stopCardsArray);

  const onCardDelete = (id: number) => {
    setStopCardList(stopCardList.filter(s => s.id !== id));
  };
  console.log('hash:', hash(stopCardList));
  const onStopDelete = (cardId: number, gtfsId: string) => {
    const card = stopCardList.find(card => card.id === cardId);
    card.stops = card.stops.filter(stop => stop.gtfsId !== gtfsId);
    const array = stopCardList.slice();
    const index = stopCardList.indexOf(card);
    array[index] = card;
    setStopCardList(array);
  };

  const setStops = (cardId: number, stops: any, reorder: boolean) => {
    const card = stopCardList.find(card => card.id === cardId);
    card.stops = reorder ? stops : card.stops.concat(stops);
    const array = stopCardList.slice();
    const index = stopCardList.indexOf(card);
    array[index] = card;
    setStopCardList(array);
  };

  const updateTitle = (cardId: number, title: string) => {
    const card = stopCardList.find(card => card.id === cardId);
    card.title = title;
    const array = stopCardList.slice();
    const index = stopCardList.indexOf(card);
    array[index] = card;
    setStopCardList(array);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setStopCardList(arrayMove(stopCardList, oldIndex, newIndex));
  };

  const modifiedStopCardList = stopCardList.map(card => {
    return {
      ...card,
      onCardDelete: onCardDelete,
      onStopDelete: onStopDelete,
      setStops: setStops,
      updateTitle: updateTitle,
    };
  });

  return (
    <SortableStopCardList
      items={modifiedStopCardList}
      useDragHandle
      onSortEnd={onSortEnd}
    />
  );
};

export default StopCardListContainer;
