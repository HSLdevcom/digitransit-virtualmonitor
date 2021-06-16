import React, { FC, useState } from 'react';
import StopCardRow from './StopCardRow';
import arrayMove from 'array-move';
import { v4 as uuid } from 'uuid';
import hash from 'object-hash';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ICardInfo } from './CardInfo';
import monitorAPI from '../api';
import { Redirect } from 'react-router-dom';
import './StopCardListContainer.scss';

const StopCardItem = ({ value: item, possibleToMove, index, totalCount }) => {
  const cardInfo: ICardInfo = {
    index: index,
    id: item.id,
    title: item.title,
    layout: item.layout,
    duration: item.duration,
    possibleToMove: possibleToMove,
  };
  return (
    <li className="stopcard" id={`stopcard_${cardInfo.id}`}>
      <StopCardRow
        cardsCount={totalCount}
        cardInfo={cardInfo}
        columns={item.columns}
        onCardDelete={item.onCardDelete}
        onCardMove={item.onCardMove}
        setStops={item.setStops}
        onStopDelete={item.onStopDelete}
        onStopMove={item.onStopMove}
        updateCardInfo={item.updateCardInfo}
      />
    </li>
  );
};

const StopCardList = ({ items }) => {
  return (
    <ul className="stopcards">
      {items.map((item, index) => {
        return (
          <StopCardItem
            key={uuid()}
            index={index}
            value={item}
            totalCount={items.length}
            possibleToMove={items.length > 1}
          />
        );
      })}
    </ul>
  );
};

const defaultStopCard = t => ({
  id: 1,
  title: t('viewEditorName'),
  columns: {
    left: {
      inUse: true,
      title: t('sideLeft'),
      stops: [],
    },
    right: {
      inUse: false,
      title: t('sideRight'),
      stops: [],
    },
  },
  layout: 2,
  duration: 5,
});

const StopCardListContainer: FC<WithTranslation> = ({ t }) => {
  const [stopCardList, setStopCardList] = useState([defaultStopCard(t)]);
  const [redirect, setRedirect] = useState(false);
  const [view, setView] = useState(undefined);

  const onCardDelete = (id: number) => {
    setStopCardList(stopCardList.filter(s => s.id !== id));
  };

  const onCardMove = (oldIndex: number, newIndex: number) => {
    setStopCardList(arrayMove(stopCardList, oldIndex, newIndex));
  };

  const onStopDelete = (cardId: number, side: string, gtfsId: string) => {
    const cardIndex = stopCardList.findIndex(card => card.id === cardId);
    stopCardList[cardIndex].columns[side].stops = stopCardList[
      cardIndex
    ].columns[side].stops.filter(stop => stop.gtfsId !== gtfsId);
    setStopCardList(stopCardList.slice());
  };

  const onStopMove = (cardId: number, side: string, gtfsId: string) => {
    const otherSide = side === 'left' ? 'right' : 'left';
    const cardIndex = stopCardList.findIndex(card => card.id === cardId);
    const cardToMove = stopCardList[cardIndex].columns[side].stops.filter(
      stop => stop.gtfsId === gtfsId,
    );
    stopCardList[cardIndex].columns[side].stops = stopCardList[
      cardIndex
    ].columns[side].stops.filter(stop => stop.gtfsId !== gtfsId);
    stopCardList[cardIndex].columns[otherSide].stops =
      stopCardList[cardIndex].columns[otherSide].stops.concat(cardToMove);
    setStopCardList(stopCardList.slice());
  };

  const setStops = (
    cardId: number,
    side: string,
    stops: any,
    reorder: boolean,
    gtfsIdForHidden: string,
  ) => {
    const cardIndex = stopCardList.findIndex(card => card.id === cardId);

    if (!gtfsIdForHidden) {
      stopCardList[cardIndex].columns[side].stops = reorder
        ? stops
        : stopCardList[cardIndex].columns[side].stops.concat(stops);
      setStopCardList(stopCardList.slice());
    } else {
      const stopIndex = stopCardList[cardIndex].columns[side].stops.findIndex(
        stop => stop.gtfsId === gtfsIdForHidden,
      );
      stopCardList[cardIndex].columns[side].stops[stopIndex] = stops;
      setStopCardList(stopCardList.slice());
    }
  };

  const updateCardInfo = (cardId: number, type: string, value: string) => {
    const cardIndex = stopCardList.findIndex(card => card.id === cardId);
    if (type === 'title') {
      stopCardList[cardIndex].title = value;
    } else if (type === 'title-left') {
      stopCardList[cardIndex].columns['left'].title = value;
    } else if (type === 'title-right') {
      stopCardList[cardIndex].columns['right'].title = value;
      stopCardList[cardIndex].columns['right'].inUse = true;
    } else if (type === 'layout') {
      stopCardList[cardIndex].layout = Number(value);
    } else if (type === 'duration') {
      stopCardList[cardIndex].duration = Number(value);
    }
    setStopCardList(stopCardList.slice());
  };

  const addNew = () => {
    let cnt = stopCardList.length + 1;
    while (cnt > 0) {
      if (stopCardList.filter(s => s.id === cnt).length === 0) {
        const newCard = {
          ...defaultStopCard(t),
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
      onCardMove: onCardMove,
      onStopDelete: onStopDelete,
      onStopMove: onStopMove,
      setStops: setStops,
      updateCardInfo: updateCardInfo,
    };
  });

  const createMonitor = () => {
    const newCard = {
      ...stopCardList,
      contenthash: hash(stopCardList, {
        algorithm: 'md5',
        encoding: 'base64',
      }).replace('/', '-'),
    };
    monitorAPI.create(newCard).then(res => {
      // eslint-disable-next-line no-console
      console.log(res);
      setRedirect(true);
      setView(newCard);
    });
  };
  if (redirect && view) {
    return (
      <Redirect
        to={{
          pathname: '/view',
          search: `?cont=${view.contenthash}`,
          state: { view: view },
        }}
      />
    );
  }

  return (
    <>
      <StopCardList items={modifiedStopCardList} />
      <div className="buttons">
        <button
          className="button"
          style={{ color: `#007AC9` }}
          onClick={addNew}
        >
          <span>{t('prepareDisplay')}</span>
        </button>
        <button className="button" style={{ color: `#007AC9` }}>
          <span>{t('previewView')}</span>
        </button>
        <button
          className="button"
          style={{ color: `#007AC9` }}
          onClick={createMonitor}
        >
          <span>{t('displayEditorStaticLink')}</span>
        </button>
      </div>
    </>
  );
};

export default withTranslation('translations')(StopCardListContainer);
