import React, { FC, useState, useEffect } from 'react';
import StopRow from './StopRow';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { v4 as uuid } from 'uuid';

interface Props {
  side: string;
  stops: any;
  cardId: number;
  layout: number;
  onStopDelete?: (cardId: number, side: string, gtfsId: string) => void;
  setStops?: (
    cardId: number,
    side: string,
    stops: any,
    reorder: boolean,
    gtfsIdForHidden: string,
  ) => void;
}

const SortableStopItem = SortableElement(({ value: item }) => {
  return (
    <li className="stop">
      <StopRow
        side={item.side}
        stop={item}
        stopId={item.gtfsId}
        onStopDelete={item.onStopDelete}
        setStops={item.setStops}
      />
    </li>
  );
});

const SortableStopList = SortableContainer(({ items }) => {
  return (
    <ul className="stops">
      {items.map((item, index) => {
        return <SortableStopItem key={uuid()} index={index} value={item} />;
      })}
    </ul>
  );
});

const StopListContainer: FC<Props> = props => {
  const [stopList, setStopList] = useState([]);
  useEffect(() => {
    setStopList(props.stops[props.side].stops);
  }, [props.stops[props.side].stops]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const reorderedList = arrayMove(stopList, oldIndex, newIndex);
    setStopList(reorderedList);
    if (props && props.cardId && props.setStops) {
      props.setStops(props.cardId, props.side, reorderedList, true, undefined);
    }
  };

  const modifiedStopList =
    stopList.length > 0
      ? stopList.map(stop => ({
          side: props.side,
          ...stop,
          cardId: props.cardId,
          layout: props.layout,
          onStopDelete: props.onStopDelete,
          setStops: props.setStops,
        }))
      : [];

  return (
    <SortableStopList
      items={modifiedStopList}
      useDragHandle
      onSortEnd={onSortEnd}
    />
  );
};

export default StopListContainer;
