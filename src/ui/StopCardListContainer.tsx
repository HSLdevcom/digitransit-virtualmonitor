import { IStop } from '../util/Interfaces';
import React, { FC, useEffect, useState } from 'react';
import StopCardRow from './StopCardRow';
import arrayMove from 'array-move';
import { v4 as uuid } from 'uuid';
import hash from 'object-hash';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ICardInfo } from './CardInfo';
import PreviewModal from './PreviewModal';
import monitorAPI from '../api';
import { Redirect } from 'react-router-dom';
import DisplaySettings from './DisplaySettings';
import './StopCardListContainer.scss';
import { defaultStopCard } from '../util/stopCardUtil';
interface IProps {
  feedIds: Array<string>;
  defaultStopCardList: any;
  languages: Array<string>;
}

const StopCardItem = ({
  value: item,
  possibleToMove,
  index,
  totalCount,
  feedIds,
  orientation,
}) => {
  const cardInfo: ICardInfo = {
    feedIds: feedIds,
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
        feedIds={feedIds}
        orientation={orientation}
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

const StopCardList = ({ orientation, feedIds, items }) => {
  return (
    <ul className="stopcards">
      {items.map((item, index) => {
        return (
          <StopCardItem
            orientation={orientation}
            feedIds={feedIds}
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

const StopCardListContainer: FC<IProps & WithTranslation> = ({
  feedIds,
  t,
  defaultStopCardList,
  ...props
}) => {
  const [stopCardList, setStopCardList] = useState(defaultStopCardList);
  const [languages, setLanguages] = useState(props.languages);
  const [orientation, setOrientation] = useState('horizontal');
  const [redirect, setRedirect] = useState(false);
  const [view, setView] = useState(undefined);
  const [isOpen, setOpen] = useState(false);

  const openPreview = () => {
    setOpen(true);
  };
  const closePreview = () => {
    setOpen(false);
  };

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
    stops: Array<IStop>,
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

  const handleLanguageChange = (language: string) => {
    if (!languages.includes(language)) {
      setLanguages(languages.concat(language));
    } else {
      const langs = languages.slice();
      langs.splice(languages.indexOf(language), 1);
      setLanguages(langs);
    }
  };

  const handleOrientation = (orientation: string) => {
    setOrientation(orientation);
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

  const createButtonsDisabled = () => {
    return !(languages.length > 0);
  };

  const createMonitor = () => {
    const languageArray = ['fi', 'sv', 'en'];
    const cardArray = stopCardList.slice();
    cardArray.forEach(card => {
      card.columns.left.stops = card.columns.left.stops.map(stop => {
        return {
          gtfsId: stop.gtfsId,
          locationType: stop.locationType,
          hiddenRoutes: stop.hiddenRoutes?.map(hr => {
            return {
              code: hr.code,
            };
          }),
        };
      });
      card.columns.right.stops = card.columns.right.stops.map(stop => {
        return {
          gtfsId: stop.gtfsId,
          locationType: stop.locationType,
          hiddenRoutes: stop.hiddenRoutes?.map(hr => {
            return {
              code: hr.code,
            };
          }),
        };
      });
    });
    const newCard = {
      cards: cardArray,
      languages: languageArray.filter(lan => languages.includes(lan)),
      contenthash: hash(stopCardList, {
        algorithm: 'md5',
        encoding: 'base64',
      }).replaceAll('/', '-'),
    };
    monitorAPI.create(newCard).then(res => {
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
          state: { view: view.cards },
        }}
      />
    );
  }
  const cards = {
    cards: stopCardList,
  };
  return (
    <>
      {isOpen && (
        <PreviewModal view={cards} isOpen={isOpen} onClose={closePreview} />
      )}
      <DisplaySettings
        orientation={orientation}
        handleOrientation={handleOrientation}
        languages={languages}
        handleChange={handleLanguageChange}
      />
      <StopCardList
        orientation={orientation}
        feedIds={feedIds}
        items={modifiedStopCardList}
      />
      <div className="buttons">
        <button className="button" onClick={addNew}>
          <span>{t('prepareDisplay')}</span>
        </button>
        <button
          disabled={createButtonsDisabled()}
          className="button"
          onClick={openPreview}
        >
          <span>{t('previewView')}</span>
        </button>
        <button
          disabled={createButtonsDisabled()}
          className="button"
          onClick={createMonitor}
        >
          <span>{t('displayEditorStaticLink')}</span>
        </button>
      </div>
    </>
  );
};

export default withTranslation('translations')(StopCardListContainer);
