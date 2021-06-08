import React, { FC, useState, useEffect } from 'react';
import StopRow from './StopRow';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { v4 as uuid } from 'uuid';

interface Props {
  stops: any,
  cardId: number,
  onStopDelete?: Function,
  setStops?: Function,
}

const SortableStopItem = SortableElement(({value}) => {
  return (
    <li className="stop"><StopRow stop={value}  stopId={value.gtfsId} onDelete={() => value.onStopDelete(value.cardId, value.gtfsId)}/></li>
  );
});

const SortableStopList = SortableContainer(({items}) => {
  return (
    <ul className="stops">
      {items.map((item, index) => {
        return (
          <SortableStopItem key={uuid()} index={index} value={item} />
        )
      })}
    </ul>
  );
});

const StopListContainer : FC<Props> = (props) => {
  const [stopList, setStopList] = useState([]);
  useEffect(() => {
    setStopList(props.stops);
  }, [props.stops]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const reorderedList = arrayMove(stopList, oldIndex, newIndex);
    setStopList(reorderedList);
    if(props && props.cardId && props.setStops) {
      props.setStops(props.cardId, reorderedList, true);
    }
  };

  const modifiedStopList = stopList.map(stop => ({
    ...stop,
    cardId: props.cardId,
    onStopDelete: props.onStopDelete
  }));

  return (
    <SortableStopList items={modifiedStopList} useDragHandle onSortEnd={onSortEnd} />
  )
}

export default StopListContainer;
