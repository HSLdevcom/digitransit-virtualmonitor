import React, { FC, useState, useEffect } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IStop } from '../util/Interfaces';
import Icon from './Icon';
import StopListTitleInput from './StopListTitleInput';
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

  const setTitle = (
    side: string,
    changed: boolean,
    title: string = undefined,
  ) => {
    if (title) {
      side === 'left' ? setTitleLeft(title) : setTitleRight(title);
    }
    side === 'left' ? setChangedLeft(changed) : setChangedRight(changed);
  };

  const valueLeft = changedLeft ? titleLeft : props.titleLeft;
  const valueRight = changedRight ? titleRight : props.titleRight;
  return (
    <div className="east-west-inputs">
      {props.languages?.includes('fi') && (
        <StopListTitleInput
          lang="fi"
          side={side}
          titleLeft={titleLeft}
          titleRight={titleRight}
          updateCardInfo={updateCardInfo}
          cardInfoId={cardInfo.id}
          setTitle={setTitle}
          itemsHeader={side == 'left' ? leftItemsHeader : rightItemsHeader}
          value={side === 'left' ? valueLeft : valueRight}
        />
      )}
      {props.languages?.includes('sv') && (
        <StopListTitleInput
          lang="sv"
          side={side}
          titleLeft={titleLeft}
          titleRight={titleRight}
          updateCardInfo={updateCardInfo}
          cardInfoId={cardInfo.id}
          setTitle={setTitle}
          itemsHeader={side == 'left' ? leftItemsHeader : rightItemsHeader}
          value={side === 'left' ? valueLeft : valueRight}
        />
      )}
      {props.languages?.includes('en') && (
        <StopListTitleInput
          lang="en"
          side={side}
          titleLeft={titleLeft}
          titleRight={titleRight}
          updateCardInfo={updateCardInfo}
          cardInfoId={cardInfo.id}
          setTitle={setTitle}
          itemsHeader={side == 'left' ? leftItemsHeader : rightItemsHeader}
          value={side === 'left' ? valueLeft : valueRight}
        />
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

  const showStopTitles = getLayout(cardInfo.layout).isMultiDisplay;

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
            leftItems.map((item, index) => {
              return (
                <li key={`s-${index}`} className="stop">
                  <StopRow
                    key={uuid()}
                    stop={item}
                    side={'left'}
                    onStopDelete={props.onStopDelete}
                    onStopMove={props.onStopMove}
                    setStops={props.setStops}
                    rightStops={rightItems}
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
                <li className="stop" key={uuid()}>
                  <StopRow
                    key={uuid()}
                    stop={item}
                    side={'right'}
                    onStopDelete={props.onStopDelete}
                    onStopMove={props.onStopMove}
                    setStops={props.setStops}
                    leftStops={leftItems}
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
        leftStops={leftItems}
        rightItems={addInfoToItems(props, rightItems, 'right')}
        rightItemsHeader={props.t('headerSideRight')}
        rightItemsPlaceHolder={props.t('placeholderSideRight', {
          title: props.stops['left'].title,
        })}
        rightTitle={props.stops['right'].title}
        rightStops={rightItems}
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
