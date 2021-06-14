import React, { FC, useState, useEffect, useRef } from 'react';
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

const SortableStopItem = SortableElement((props) => {
  const {item} = props;
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

const SortableStopList = SortableContainer((props) => {
  const {items, area, isDragging} = props;
  return (
    <ul className="stops">
      {items && items.map((item, index) => {
        return <SortableStopItem area={area} key={uuid()} index={index} item={item} collection={area} isDragging={isDragging} />;
      })}
    </ul>
  );
});

const StopListContainer: FC<Props> = props => {
  console.log('PROPS:', props);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [draggingItemIndex, setDraggingItemIndex] = useState(null);
  const [targetOrderIndex, setTargetOrderIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sourceArea, setSourceArea] = useState(null);
  const [targetArea, setTargetArea] = useState(null);
  const leftRef = useRef();
  const rightRef = useRef();

  /*useEffect(() => {
    setStopList(props.stops[props.side].stops);
  }, [props.stops[props.side].stops]);

  const handleDragEnd = ({ oldIndex, newIndex }) => {
    const reorderedList = arrayMove(stopList, oldIndex, newIndex);
    setStopList(reorderedList);
    if (props && props.cardId && props.setStops) {
      props.setStops(props.cardId, props.side, reorderedList, true, undefined);
    }
  };*/

  const items = props.side === 'left' ? leftItems : rightItems;
  const modifiedItems =
    items.length > 0
      ? items.map(stop => ({
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
      /*area={props.side}
      items={modifiedStopList}
      isDragging={props.isDragging}
      useDragHandle
      onSortEnd={onSortEnd}*/
      axis="y"
      area={props.side}
      items={modifiedItems}
      draggingItem={draggingItem}
      isDragging={isDragging}
      sourceArea={sourceArea}
      targetArea={targetArea}
      ref={props.side === 'left' ? leftRef : rightRef}
      selfRef={props.side === 'left' ? leftRef : rightRef}
      otherRef={props.side === 'left' ? rightRef : leftRef}
      //onSortStart={handleDragStart}
      //onSortOver={handleDragOver}
      //onSortEnd={handleDragEnd}
    />
  );
};

export default StopListContainer;
