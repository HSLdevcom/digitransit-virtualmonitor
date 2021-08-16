import cx from 'classnames';
import { IStop } from '../util/Interfaces';
import React, { FC, useState } from 'react';
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
import { getLayout } from '../util/getLayout';

import { defaultStopCard } from '../util/stopCardUtil';
import Loading from './Loading';
interface IProps {
  feedIds: Array<string>;
  defaultStopCardList: any;
  languages: Array<string>;
  loading?: boolean;
  vertical?: boolean;
}

const StopCardItem = ({
  value: item,
  possibleToMove,
  index,
  totalCount,
  feedIds,
  orientation,
  languages,
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
        languages={languages}
      />
    </li>
  );
};

const StopCardList = ({ orientation, feedIds, items, languages }) => {
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
            languages={languages}
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
  loading = false,
  ...props
}) => {
  const [stopCardList, setStopCardList] = useState(defaultStopCardList);
  const [languages, setLanguages] = useState(props.languages);
  const [orientation, setOrientation] = useState(defaultStopCardList[0].layout > 11 ? 'vertical' : 'horizontal');
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

  const updateCardInfo = (
    cardId: number,
    type: string,
    value: string,
    lang = '',
  ) => {
    const cardIndex = stopCardList.findIndex(card => card.id === cardId);
    if (type === 'title') {
      if (!stopCardList[cardIndex].title) {
        const title = {
          fi: '',
          sv: '',
          en: '',
        };
        title[lang] = value;
        stopCardList[cardIndex].title = title;
      } else {
        stopCardList[cardIndex].title[lang] = value;
      }
    } else if (type === 'title-left') {
      if (
        !stopCardList[cardIndex].columns['left'].title ||
        typeof stopCardList[cardIndex].columns['left'].title === 'string'
      ) {
        const leftTitle = {
          fi: '',
          sv: '',
          en: '',
        };
        leftTitle[lang] = value;
        stopCardList[cardIndex].columns['left'].title = leftTitle;
      } else {
        stopCardList[cardIndex].columns['left'].title[lang] = value;
      }
    } else if (type === 'title-right') {
      if (
        !stopCardList[cardIndex].columns['right'].title ||
        typeof stopCardList[cardIndex].columns['right'].title === 'string'
      ) {
        const rightTitle = {
          fi: '',
          sv: '',
          en: '',
        };
        rightTitle[lang] = value;
        stopCardList[cardIndex].columns['right'].title = rightTitle;
      } else {
        stopCardList[cardIndex].columns['right'].title[lang] = value;
      }

      stopCardList[cardIndex].columns['right'].inUse = true;
    } else if (type === 'layout') {
      if (
        getLayout(stopCardList[cardIndex].layout)[2] &&
        !getLayout(Number(value))[2]
      ) {
        stopCardList[cardIndex].columns.left.stops = stopCardList[
          cardIndex
        ].columns.left.stops.concat(
          stopCardList[cardIndex].columns.right.stops.filter(rs =>
            stopCardList[cardIndex].columns.left.stops.includes(rs.gtfsId),
          ),
        );
        stopCardList[cardIndex].columns.right.stops = [];
        stopCardList[cardIndex].columns.left.title[lang] = t('sideLeft');
        stopCardList[cardIndex].columns.right.title[lang] = t('sideRight');
      }
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
    stopCardList.forEach(card =>
      updateCardInfo(
        card.id,
        'layout',
        orientation === 'horizontal' ? '2' : '12',
      ),
    );
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
          name: stop.name,
          gtfsId: stop.gtfsId,
          locationType: stop.locationType,
          settings: stop.settings,
        };
      });
      card.columns.right.stops = card.columns.right.stops.map(stop => {
        return {
          name: stop.name,
          gtfsId: stop.gtfsId,
          locationType: stop.locationType,
          settings: stop.settings,
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
  if (loading) {
    return (
      <div className="stop-card-list-container">
        <Loading white />
      </div>
    );
  }

  return (
    <div className="stop-card-list-container">
      {isOpen && (
        <PreviewModal
          view={cards}
          languages={languages}
          isOpen={isOpen}
          onClose={closePreview}
          isLandscape={orientation === 'horizontal' ? true : false}
        />
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
        languages={languages}
      />
      <div className="buttons">
        <button className={cx('button', 'prepare')} onClick={addNew}>
          <span>{t('prepareDisplay')} </span>
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
    </div>
  );
};

export default withTranslation('translations')(StopCardListContainer);
