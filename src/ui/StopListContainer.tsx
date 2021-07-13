import React, { FC, useState, useEffect } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IStop } from '../util/Interfaces';
import Icon from './Icon';
import StopRow from './StopRow';
import { v4 as uuid } from 'uuid';
import cx from 'classnames';
import { focusToInput, onClick } from './InputUtils';
import { getLayout } from '../util/getLayout';
import { ICardInfo } from './CardInfo';

interface Props {
  side?: string;
  stops: any;
  onStopDelete?: (cardId: number, side: string, gtfsId: string) => void;
  onStopMove?: (cardId: number, side: string, gtfsId: string) => void;
  setStops?: (
    cardId: number,
    side: string,
    stops: Array<IStop>,
    reorder: boolean,
    gtfsIdForHidden: string,
  ) => void;
  cardInfo: ICardInfo;
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
  const [titleLang, setTitleLang] = useState('');
  const [changedLeft, setChangedLeft] = useState(false);
  const [titleRight, setTitleRight] = useState('');
  const [changedRight, setChangedRight] = useState(false);
  const [focus, setFocus] = useState(false);
  const {
    cardInfo,
    side,
    updateCardInfo,
    leftItemsHeader,
    rightItemsHeader,
    languages,
  } = props;
  const onBlur = (event: any, side: string, lang) => {
    setFocus(false);
    if (event && updateCardInfo) {
      updateCardInfo(
        cardInfo.id,
        `title-${side}`,
        event.target.value,
        titleLang,
      );
      setTitleLang(lang);
      if (side === 'left') {
        setChangedLeft(false);
      } else {
        setChangedRight(false);
      }
    }
  };

  const isKeyboardSelectionEvent = (event: any, side: string, lang: string) => {
    const backspace = [8, 'Backspace'];
    const space = [13, ' ', 'Spacebar'];
    const enter = [32, 'Enter'];
    setTitleLang(lang);
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
          setChangedLeft(true);
        } else {
          setTitleRight('');
          setChangedRight(true);
        }
      } else if (key.length === 1) {
        event.target.value = key;
        if (side === 'left') {
          setTitleLeft(key);
          setChangedLeft(true);
        } else {
          setTitleRight(key);
          setChangedRight(true);
        }
      }
      return false;
    }

    if (key && backspace.includes(key)) {
      if (side === 'left') {
        setTitleLeft(titleLeft.slice(0, -1));
        setChangedLeft(true);
      } else {
        setTitleRight(titleRight.slice(0, -1));
        setChangedRight(true);
      }
      return false;
    }

    if (!key || !enter.includes(key)) {
      if (key.length === 1) {
        if (side === 'left') {
          setTitleLeft(titleLeft.concat(key));
          setChangedLeft(true);
        } else {
          setTitleRight(titleRight ? titleRight.concat(key) : key);
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
        side === 'left' ? titleLeft : titleRight ? titleRight : '',
        titleLang,
      );
      if (side === 'left') {
        setChangedLeft(false);
      } else {
        setChangedRight(false);
      }
    }
    return true;
  };

  const valueLeft = changedLeft ? titleLeft : props.titleLeft;
  const valueRight = changedRight ? titleRight : props.titleRight;
  return (
    <div className="east-west-inputs">
      {props.languages?.includes('fi') && (
        <>
          <div className="header">
            {side === 'left'
              ? leftItemsHeader.concat(' - FI ')
              : rightItemsHeader.concat(' - FI ')}
          </div>
          <div className={cx('stop-list-title', side)}>
            <input
              className={`input-${side}`}
              id={`stop-list-title-input-${side}-fi`}
              onClick={e => onClick(e)}
              onFocus={() => setFocus(true)}
              onKeyDown={e => isKeyboardSelectionEvent(e, side, 'fi')}
              onBlur={e =>
                !isKeyboardSelectionEvent(e, side, 'fi') &&
                onBlur(e, side, 'fi')
              }
              value={side === 'left' ? valueLeft['fi'] : valueRight['fi']}
            />
            {!focus && (
              <div
                role="button"
                onClick={() => focusToInput(`stop-list-title-input-${side}-fi`)}
              >
                <Icon img="edit" color={'#007ac9'} width={20} height={20} />
              </div>
            )}
          </div>
        </>
      )}
      {props.languages?.includes('sv') && (
        <>
          <div className="header">
            {side === 'left'
              ? leftItemsHeader.concat(' - SV ')
              : rightItemsHeader.concat(' - SV ')}
          </div>
          <div className={cx('stop-list-title', side)}>
            <input
              className={`input-${side}`}
              id={`stop-list-title-input-${side}-sv`}
              onClick={e => onClick(e)}
              onFocus={() => setFocus(true)}
              onKeyDown={e => isKeyboardSelectionEvent(e, side, 'sv')}
              onBlur={e =>
                !isKeyboardSelectionEvent(e, side, 'sv') &&
                onBlur(e, side, 'sv')
              }
              value={side === 'left' ? valueLeft['sv'] : valueRight['sv']}
            />
            {!focus && (
              <div
                role="button"
                onClick={() => focusToInput(`stop-list-title-input-${side}-sv`)}
              >
                <Icon img="edit" color={'#007ac9'} width={20} height={20} />
              </div>
            )}
          </div>
        </>
      )}
      {props.languages?.includes('en') && (
        <>
          <div className="header">
            {side === 'left'
              ? leftItemsHeader.concat(' - EN ')
              : rightItemsHeader.concat(' - EN ')}
          </div>
          <div className={cx('stop-list-title', side)}>
            <input
              className={`input-${side}`}
              id={`stop-list-title-input-${side}-en`}
              onClick={e => onClick(e)}
              onFocus={() => setFocus(true)}
              onKeyDown={e => isKeyboardSelectionEvent(e, side, 'en')}
              onBlur={e =>
                !isKeyboardSelectionEvent(e, side, 'en') &&
                onBlur(e, side, 'en')
              }
              value={side === 'left' ? valueLeft['en'] : valueRight['en']}
            />
            {!focus && (
              <div
                role="button"
                onClick={() => focusToInput(`stop-list-title-input-${side}-en`)}
              >
                <Icon img="edit" color={'#007ac9'} width={20} height={20} />
              </div>
            )}
          </div>
        </>
      )}
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

  const showStopTitles = getLayout(cardInfo.layout)[2];

  return (
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
      <div>
        <ul className="stops">
          {leftItems &&
            leftItems.map(item => {
              return (
                <li className="stop">
                  <StopRow
                    key={uuid()}
                    stop={item}
                    side={'left'}
                    onStopDelete={props.onStopDelete}
                    onStopMove={props.onStopMove}
                    setStops={props.setStops}
                  />
                </li>
              );
            })}
        </ul>
      </div>
      {showStopTitles && (
        <TitleItem
          side="right"
          titleRight={rightTitle}
          rightItemsHeader={rightItemsHeader}
          cardInfo={cardInfo}
          updateCardInfo={updateCardInfo}
          languages={languages}
        />
      )}
      {showStopTitles && rightItems.length === 0 && (
        <StopListPlaceHolder text={rightItemsPlaceHolder} />
      )}
      <div>
        <ul className="stops">
          {rightItems &&
            rightItems.map(item => {
              return (
                <li className="stop">
                  <StopRow
                    key={uuid()}
                    stop={item}
                    side={'right'}
                    onStopDelete={props.onStopDelete}
                    onStopMove={props.onStopMove}
                    setStops={props.setStops}
                  />
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

const addInfoToItems = (props, items, side) => {
  const modifiedItems =
    items.length > 0
      ? items.map(item => ({
          ...item,
          side: side,
          cardId: props.cardInfo.id,
          layout: props.cardInfo.layout,
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
        leftItems={addInfoToItems(props, leftItems, 'left')}
        leftItemsHeader={props.t('headerSideLeft')}
        leftItemsPlaceHolder={props.t('placeholderSideLeft')}
        leftTitle={props.stops['left'].title}
        rightItems={addInfoToItems(props, rightItems, 'right')}
        rightItemsHeader={props.t('headerSideRight')}
        rightItemsPlaceHolder={props.t('placeholderSideRight', {
          title: props.stops['left'].title,
        })}
        rightTitle={props.stops['right'].title}
        onStopDelete={props.onStopDelete}
        onStopMove={props.onStopMove}
        setStops={props.setStops}
        cardInfo={props.cardInfo}
        updateCardInfo={props.updateCardInfo}
        languages={props.languages}
      />
    </div>
  );
};

export default withTranslation('translations')(StopListContainer);
