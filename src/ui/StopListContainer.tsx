import React, { FC, useState, useEffect } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import Icon from './Icon';
import StopRow from './StopRow';
import { v4 as uuid } from 'uuid';
import cx from 'classnames';
import { focusToInput, onClick } from './InputUtils';
import { getLayout } from '../util/getLayout';

interface Props {
  side?: string;
  stops: any;
  cardId: number;
  layout: number;
  onStopDelete?: (cardId: number, side: string, gtfsId: string) => void;
  onStopMove?: (cardId: number, side: string, gtfsId: string) => void;
  setStops?: (
    cardId: number,
    side: string,
    stops: any,
    reorder: boolean,
    gtfsIdForHidden: string,
  ) => void;
}

const TitleItem = props => {
  const [newTitleLeft, setNewTitleLeft] = useState(props.titleLeft);
  const [changedLeft, setChangedLeft] = useState(false);
  const [newTitleRight, setNewTitleRight] = useState(props.titleRight);
  const [changedRight, setChangedRight] = useState(false);
  const { cardInfo, side, updateCardInfo, leftItemsHeader, rightItemsHeader } =
    props;

  const onBlur = (event: any, side: string) => {
    if (event && updateCardInfo) {
      updateCardInfo(cardInfo.id, `title-${side}`, event.target.value);
      if (side === 'left') {
        setChangedLeft(false);
      } else {
        setChangedRight(false);
      }
    }
  };

  const isKeyboardSelectionEvent = (event: any, side: string) => {
    const backspace = [8, 'Backspace'];
    const space = [13, ' ', 'Spacebar'];
    const enter = [32, 'Enter'];

    const key = (event && (event.key || event.which || event.keyCode)) || '';

    const newTitle = side === 'left' ? newTitleLeft : newTitleRight;

    if (
      key &&
      typeof event.target.selectionStart === 'number' &&
      event.target.selectionStart === 0 &&
      event.target.selectionEnd === event.target.value.length &&
      newTitle
    ) {
      if (backspace.concat(space).includes(key)) {
        if (side === 'left') {
          setNewTitleLeft('');
          setChangedLeft(true);
        } else {
          setNewTitleRight('');
          setChangedRight(true);
        }
      } else if (key.length === 1) {
        event.target.value = key;
        if (side === 'left') {
          setNewTitleLeft(key);
          setChangedLeft(true);
        } else {
          setNewTitleRight(key);
          setChangedRight(true);
        }
      }
      return false;
    }

    if (key && backspace.includes(key)) {
      if (side === 'left') {
        setNewTitleLeft(newTitleLeft.slice(0, -1));
        setChangedLeft(true);
      } else {
        setNewTitleRight(newTitleRight.slice(0, -1));
        setChangedRight(true);
      }
      return false;
    }

    if (!key || !enter.includes(key)) {
      if (key.length === 1) {
        if (side === 'left') {
          setNewTitleLeft(newTitleLeft.concat(key));
          setChangedLeft(true);
        } else {
          setNewTitleRight(newTitleRight ? newTitleRight.concat(key) : key);
          setChangedRight(true);
        }
      }
      return false;
    }

    event.preventDefault();
    if (updateCardInfo) {
      updateCardInfo(
        cardInfo.id,
        `title-${side}`,
        side === 'left' ? newTitleLeft : newTitleRight ? newTitleRight : '',
      );
      if (side === 'left') {
        setChangedLeft(false);
      } else {
        setChangedRight(false);
      }
    }
    return true;
  };

  const valueLeft = changedLeft ? newTitleLeft : props.titleLeft;
  const valueRight = changedRight ? newTitleRight : props.titleRight;
  return (
    <>
      <div className="header">
        {side === 'left' ? leftItemsHeader : rightItemsHeader}
      </div>
      <div className={cx('stop-list-title', side)}>
        <input
          className={`input-${side}`}
          id={`stop-list-title-input-${side}`}
          onClick={e => onClick(e)}
          onKeyDown={e => isKeyboardSelectionEvent(e, side)}
          onBlur={e => !isKeyboardSelectionEvent(e, side) && onBlur(e, side)}
          value={side === 'left' ? valueLeft : valueRight}
        />
        <div
          role="button"
          onClick={() => focusToInput(`stop-list-title-input-${side}`)}
        >
          <Icon img="edit" color={'#007ac9'} width={20} height={20} />
        </div>
      </div>
    </>
  );
};

const StopListPlaceHolder = props => {
  const { title } = props;
  return (
    <ul className="stops">
      <li className="stop">
        <div className="stop-row-container placeholder">
          <div className="placeholder-no-stops">{title ? title : ''}</div>
        </div>
      </li>
    </ul>
  );
};

const StopItem = props => {
  const { item, collection } = props;
  return (
    <li className="stop">
      <StopRow
        side={collection === 'leftItems' ? 'left' : 'right'}
        stop={item}
        stopId={item.gtfsId}
        onStopDelete={item.onStopDelete}
        onStopMove={item.onStopMove}
        setStops={item.setStops}
      />
    </li>
  );
};

const StopList = props => {
  const {
    leftItems,
    leftTitle,
    rightTitle,
    rightItems,
    layout,
    leftItemsPlaceHolder,
    rightItemsPlaceHolder,
    leftItemsHeader,
    rightItemsHeader,
  } = props;

  const showStopTitles = getLayout(layout)[2];

  return (
    <div>
      {showStopTitles && (
        <TitleItem
          side="left"
          titleLeft={leftTitle}
          leftItemsHeader={leftItemsHeader}
        />
      )}
      {showStopTitles && leftItems.length === 0 && (
        <StopListPlaceHolder title={leftItemsPlaceHolder} />
      )}
      <div>
        <ul className="stops">
          {leftItems &&
            leftItems.map((item, index) => {
              return (
                <StopItem
                  key={uuid()}
                  index={index}
                  item={item}
                  collection={'leftItems'}
                />
              );
            })}
        </ul>
      </div>
      {showStopTitles && (
        <TitleItem
          side="right"
          titleRight={rightTitle}
          rightItemsHeader={rightItemsHeader}
        />
      )}
      {showStopTitles && rightItems.length === 0 && (
        <StopListPlaceHolder title={rightItemsPlaceHolder} />
      )}
      <div>
        <ul className="stops">
          {rightItems &&
            rightItems.map((item, index) => {
              return (
                <StopItem
                  key={uuid()}
                  index={index}
                  item={item}
                  collection={'rightItems'}
                />
              );
            })}
        </ul>
      </div>
    </div>
  );
};

const addInfoToItems = (props, items) => {
  const modifiedItems =
    items.length > 0
      ? items.map(stop => ({
          side: props.side,
          ...stop,
          cardId: props.cardId,
          layout: props.layout,
          onStopDelete: props.onStopDelete,
          onStopMove: props.onStopMove,
          setStops: props.setStops,
        }))
      : [];
  return modifiedItems;
};

const StopListContainer: FC<Props & WithTranslation> = props => {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);

  useEffect(() => {
    setLeftItems(props.stops['left'].stops);
  }, [props.stops['left'].stops]);

  useEffect(() => {
    setRightItems(props.stops['right'].stops);
  }, [props.stops['right'].stops]);

  return (
    <div className="stop-list">
      <StopList
        leftItems={addInfoToItems(props, leftItems)}
        leftItemsHeader={props.t('headerSideLeft')}
        leftItemsPlaceHolder={props.t('placeholderSideLeft')}
        leftTitle={props.stops['left'].title}
        rightItems={addInfoToItems(props, rightItems)}
        rightItemsHeader={props.t('headerSideRight')}
        rightItemsPlaceHolder={props.t('placeholderSideRight', {
          title: props.stops['left'].title,
        })}
        rightTitle={props.stops['right'].title}
        layout={props.layout}
      />
    </div>
  );
};

export default withTranslation('translations')(StopListContainer);
