import cx from 'classnames';
import React, { useState } from 'react';
import Icon from './Icon';
import { focusToInput, onClick } from './InputUtils';

function StopListTitleInput(props: {
  lang: string;
  titleLeft: string;
  titleRight: string;
  setTitle: (side: string, changed: boolean, title?: string) => void;
  updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
    lang?: string,
  ) => void;
  cardInfoId: number;
  side: string;
  itemsHeader: string;
  value: string;
}) {
  const [titleLeft, setTitleLeft] = useState(props.titleLeft);
  const [changedLeft, setChangedLeft] = useState(false);
  const [titleRight, setTitleRight] = useState(props.titleRight);
  const [changedRight, setChangedRight] = useState(false);
  const [focus, setFocus] = useState(false);

  const onBlur = (event: any, side: string) => {
    setFocus(false);
    if (event && props.updateCardInfo) {
      props.updateCardInfo(
        props.cardInfoId,
        `title-${side}`,
        event.target.value,
        props.lang,
      );
      if (side === 'left') {
        setChangedLeft(false);
        props.setTitle('left', false);
      } else {
        setChangedRight(false);
        props.setTitle('right', false);
      }
    }
  };
  const isKeyboardSelectionEvent = (event: any, side: string) => {
    const backspace = [8, 'Backspace'];
    const space = [13, ' ', 'Spacebar'];
    const enter = [32, 'Enter'];
    const key = (event && (event.key || event.which || event.keyCode)) || '';

    if (
      key &&
      typeof event.target.selectionStart === 'number' &&
      event.target.selectionStart === 0 &&
      event.target.selectionEnd === event.target.value.length &&
      event.target.value === (side === 'left' ? titleLeft : titleRight)
    ) {
      if (backspace.concat(space).includes(key)) {
        if (side === 'left') {
          setTitleLeft('');
          props.setTitle('left', true, '');
          setChangedLeft(true);
        } else {
          setTitleRight('');
          props.setTitle('right', true, '');
          setChangedRight(true);
        }
      } else if (key.length === 1) {
        event.target.value = key;
        if (side === 'left') {
          setTitleLeft(key);
          props.setTitle('left', true, key);
          setChangedLeft(true);
        } else {
          props.setTitle('right', true, key);
          setTitleRight(key);
          setChangedRight(true);
        }
      }
      event.preventDefault();
      return false;
    }

    if (key && backspace.includes(key)) {
      if (side === 'left') {
        setTitleLeft(titleLeft.slice(0, -1));
        props.setTitle('left', true, titleLeft.slice(0, -1));
        setChangedLeft(true);
      } else {
        setTitleRight(titleLeft.slice(0, -1));
        props.setTitle('right', true, titleLeft.slice(0, -1));
        setChangedRight(true);
      }
      return false;
    }

    if (!key || !enter.includes(key)) {
      if (key.length === 1) {
        if (side === 'left') {
          setTitleLeft(titleLeft.concat(key));
          props.setTitle('left', true, titleLeft.concat(key));
          setChangedLeft(true);
        } else {
          setTitleRight(titleRight ? titleRight.concat(key) : key);
          props.setTitle(
            'right',
            true,
            titleRight ? titleRight.concat(key) : key,
          );
          setChangedRight(true);
        }
      }
      return false;
    }

    event.preventDefault();
    if (props.updateCardInfo) {
      props.updateCardInfo(
        props.cardInfoId,
        `title-${side}`,
        side === 'left' ? titleLeft : titleRight ? titleRight : '',
        props.lang,
      );
      if (side === 'left') {
        setChangedLeft(false);
        props.setTitle('left', false);
      } else {
        setChangedRight(false);
        props.setTitle('right', false);
      }
    }
    return true;
  };
  return (
    <div className="stop-list-title-input">
      <div className="header">
        {props.itemsHeader.concat(' - ').concat(props.lang.toUpperCase())}
      </div>
      <div className={cx('stop-list-title', props.side)}>
        <input
          className={`input-${props.side}`}
          id={`stop-list-title-input-${props.side}-${props.lang}`}
          onClick={onClick}
          onFocus={() => setFocus(true)}
          onKeyDown={e => isKeyboardSelectionEvent(e, props.side)}
          maxLength={13}
          onBlur={e =>
            !isKeyboardSelectionEvent(e, props.side) && onBlur(e, props.side)
          }
          value={props.value[props.lang]}
        />
        {!focus && (
          <div
            role="button"
            onClick={() =>
              focusToInput(`stop-list-title-input-${props.side}-${props.lang}`)
            }
          >
            <Icon img="edit" color={'#007ac9'} width={20} height={20} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StopListTitleInput;
