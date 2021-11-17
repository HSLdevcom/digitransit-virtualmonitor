import cx from 'classnames';
import React, { useState } from 'react';
import Icon from './Icon';
import { focusToInput, onClick } from '../util/InputUtils';
import { getPrimaryColor } from '../util/getConfig';
import { isKeyboardSelectionEvent } from '../util/browser';

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
  const [titleRight, setTitleRight] = useState(props.titleRight);
  const [focus, setFocus] = useState(false);

  const onBlur = () => {
    setFocus(false);
  };

  const onChange = (e, side) => {
    if (side === 'left') {
      setTitleLeft(e.target.value);
      props.setTitle('left', true, e.target.value);
    } else {
      setTitleRight(e.target.value);
      props.setTitle('right', true, e.target.value);
    }
    if (props.updateCardInfo) {
      props.updateCardInfo(
        props.cardInfoId,
        `title-${side}`,
        e.target.value,
        props.lang,
      );
    }
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
          onKeyDown={e => isKeyboardSelectionEvent(e)}
          maxLength={13}
          onBlur={onBlur}
          onChange={e => onChange(e, props.side)}
          value={props.value[props.lang]}
        />
        {!focus && (
          <div
            role="button"
            onClick={() =>
              focusToInput(`stop-list-title-input-${props.side}-${props.lang}`)
            }
          >
            <Icon img="edit" color={getPrimaryColor()} width={20} height={20} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StopListTitleInput;
