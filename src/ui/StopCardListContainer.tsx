import cx from 'classnames';
import { IStop, IMonitor } from '../util/Interfaces';
import React, { FC, useState } from 'react';
import StopCardRow from './StopCardRow';
import hash from 'object-hash';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ICardInfo } from './CardInfo';
import PreviewModal from './PreviewModal';
import monitorAPI from '../api';
import { Redirect } from 'react-router-dom';
import DisplaySettings from './DisplaySettings';
import { getLayout } from '../util/getLayout';
import isEqual from 'lodash/isEqual';
import { defaultStopCard } from '../util/stopCardUtil';
import Loading from './Loading';
import { isInformationDisplay } from '../util/monitorUtils';
import UserViewTitleEditor from './UserViewTitleEditor';
import { getCurrentSecondsWithMilliSeconds } from '../time';
import { v5 as uuidv5, NIL as NIL_UUID } from 'uuid';
import { uuidValidateV5 } from '../util/monitorUtils';

interface IProps {
  feedIds: Array<string>;
  defaultStopCardList: any;
  languages: Array<string>;
  loading?: boolean;
  vertical?: boolean;
  user?: any;
}

const getViewName = title => {
  if (window && window.location && window.location.search) {
    const params = window.location.search.split('&');
    if (params.length > 0 && params[0].startsWith('?name=')) {
      return decodeURI(params[0].substring(6));
    }
  }
  return title;
};

const getHash = () => {
  if (window && window.location && window.location.search) {
    const params = window.location.search.split('cont=');
    if (params[1]) {
      return params[1];
    }
  }
  return undefined;
};

const getUuid = () => {
  if (window && window.location && window.location.search) {
    const params = window.location.search.split('&');
    if (params[1] && params[1].startsWith('url=')) {
      return params[1].substring(4);
    }
  }
  return undefined;
};

const getPath = () => {
  if (window && window.location) {
    return window.location.pathname;
  }
  return undefined;
};

const createUUID = (startTime, hash) => {
  return uuidv5(
    startTime + getCurrentSecondsWithMilliSeconds() + hash,
    NIL_UUID,
  );
};

const StopCardListContainer: FC<IProps & WithTranslation> = ({
  feedIds,
  t,
  defaultStopCardList,
  loading = false,
  ...props
}) => {
  const [startTime, setStartTime] = useState(
    getCurrentSecondsWithMilliSeconds(),
  );
  const [stopCardList, setStopCardList] = useState(defaultStopCardList);
  const [languages, setLanguages] = useState(props.languages);
  const [orientation, setOrientation] = useState(
    defaultStopCardList[0].layout > 11 ? 'vertical' : 'horizontal',
  );
  const [redirect, setRedirect] = useState(false);
  const [view, setView] = useState(undefined);
  const [isOpen, setOpen] = useState(false);

  const [uuid, setUuid] = useState(getUuid());
  const [viewTitle, setViewTitle] = useState(
    getViewName(t('staticMonitorTitle')),
  );

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
    const c = stopCardList.slice();
    [c[oldIndex], c[newIndex]] = [c[newIndex], c[oldIndex]];
    setStopCardList(c);
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
    } else if (type === 'layout') {
      if (
        getLayout(stopCardList[cardIndex].layout).isMultiDisplay &&
        !getLayout(Number(value)).isMultiDisplay
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
        stopCardList[cardIndex].columns.right.inUse = true;
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

  const checkNoStops = stopCardList => {
    let noStops = false;
    stopCardList.forEach((stopCard, i) => {
      if (
        stopCard.columns.left.stops.length === 0 &&
        stopCard.columns.right.stops.length === 0
      ) {
        noStops = true;
      }
    });
    return noStops;
  };

  const createOrSaveMonitor = isNew => {
    const languageArray = ['fi', 'sv', 'en'];
    const cardArray = stopCardList.slice();
    cardArray.forEach(card => {
      if (card.layout >= 9 && card.layout < 11) {
        card.columns.right.inUse = true;
      }
      card.columns.left.stops = card.columns.left.stops.map(stop => {
        return {
          name: stop.name,
          gtfsId: stop.gtfsId,
          locationType: stop.locationType,
          settings: stop.settings,
          parentStation: stop.parentStation,
          mode: stop.mode ? stop.mode : stop.vehicleMode?.toLowerCase(),
          code: stop.code ? stop.code : null,
          locality: stop.locality,
        };
      });
      card.columns.right.stops = card.columns.right.stops.map(stop => {
        return {
          name: stop.name,
          gtfsId: stop.gtfsId,
          locationType: stop.locationType,
          settings: stop.settings,
          parentStation: stop.parentStation,
          mode: stop.mode ? stop.mode : stop.vehicleMode?.toLowerCase(),
          code: stop.code ? stop.code : null,
          locality: stop.locality,
        };
      });
    });
    const cards = cardArray.slice();
    if (cards.length === 1 && languages.length === 1) {
      cards[0].duration = 5;
    }
    const newCard: IMonitor = {
      cards: cards,
      languages: languageArray.filter(lan => languages.includes(lan)),
      isInformationDisplay: isInformationDisplay(cardArray),
      contenthash: '',
    };
    newCard.contenthash = hash(newCard, {
      algorithm: 'md5',
      encoding: 'base64',
    }).replaceAll('/', '-');

    if (isNew) {
      monitorAPI.create(newCard).then(res => {
        if (res['status'] === 200 || res['status'] === 409) {
          if (getPath() === '/createStaticView') {
            const newUuid = createUUID(newCard.contenthash, startTime);
            monitorAPI
              .createStatic(newCard.contenthash, newUuid, viewTitle)
              .then(res => {
                setUuid(newUuid);
                setView(newCard);
              });
          } else {
            setRedirect(true);
            setView(newCard);
          }
        }
      });
    } else {
      const hashChanged = !isEqual(getHash(), newCard.contenthash);
      const titleChanged = !isEqual(
        getViewName(t('staticMonitorTitle')),
        viewTitle,
      );
      if (hashChanged) {
        monitorAPI.create(newCard).then(res => {
          monitorAPI
            .updateStatic(getHash(), getUuid(), newCard.contenthash, viewTitle)
            .then(res => {
              setRedirect(true);
              setView(newCard);
            });
        });
      } else if (!hashChanged && titleChanged) {
        monitorAPI
          .updateStatic(getHash(), getUuid(), getHash(), viewTitle)
          .then(res => {
            setRedirect(true);
            setView(newCard);
          });
      } else {
        setRedirect(true);
        setView(newCard);
      }
    }
  };

  const checkIfModify = () => {
    if (
      window &&
      (window.location.href.indexOf('cont=') !== -1 ||
        window.location.pathname.split('/').length > 2) &&
      getPath() === '/createStaticView'
    ) {
      return true;
    }
    return false;
  };

  if (!redirect && view && uuid) {
    setRedirect(true);
  }

  if (redirect && view) {
    let search;
    const isStatic = getPath() === '/createStaticView';
    const url = uuid ? uuid : getUuid();
    if (isStatic && url && uuidValidateV5(url)) {
      search = `?cont=${url}`;
    } else {
      search = `?cont=${view.contenthash}`;
    }
    return (
      <Redirect
        to={{
          pathname: isStatic ? '/static' : '/view',
          search: search,
          state: {
            view: view.cards,
            viewTitle: viewTitle,
          },
        }}
      />
    );
  }

  const createAriaLabel = (key, requirements, t) => {
    const joinedRequirements = requirements.join(` ${t('or')} `);
    return t(`notPossibleTo${key}`, { requirements: joinedRequirements });
  };

  const cards: IMonitor = {
    cards: stopCardList,
    isInformationDisplay: isInformationDisplay(stopCardList),
    languages: languages,
  };
  if (loading) {
    return (
      <div className="stop-card-list-container">
        <Loading white />
      </div>
    );
  }

  const backToList = () => {
    window.location.href = '/?pocLogin';
  };

  const updateViewTitle = newTitle => {
    setViewTitle(newTitle);
  };

  const noStops = checkNoStops(modifiedStopCardList);
  const makeButtonsDisabled = !(languages.length > 0 && !noStops);
  const isModifyView = checkIfModify();

  const buttonsRequirements = [];
  if (languages.length === 0) {
    buttonsRequirements.push(t('requirementLanguage'));
  }
  if (noStops) {
    buttonsRequirements.push(t('requirementStop'));
  }

  const ariaLabelForCreate = makeButtonsDisabled
    ? createAriaLabel('Create', buttonsRequirements, t)
    : t('previewView');
  const ariaLabelForPreview = makeButtonsDisabled
    ? createAriaLabel('Preview', buttonsRequirements, t)
    : t('previewView');
  const ariaLabelForSave = makeButtonsDisabled
    ? createAriaLabel('Save', buttonsRequirements, t)
    : t('previewView');

  return (
    <div className="stop-card-list-container">
      {props.user && props.user.loggedIn && (
        <UserViewTitleEditor
          title={viewTitle}
          updateViewTitle={updateViewTitle}
          backToList={backToList}
          contentHash={getHash()}
          url={getUuid()}
          isNew={!isModifyView}
        />
      )}
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
      <ul className="stopcards">
        {modifiedStopCardList.map((item, index) => {
          const noStops =
            item.columns.left.stops.length === 0 &&
            item.columns.right.stops.length === 0;
          const cardInfo: ICardInfo = {
            feedIds: feedIds,
            index: index,
            id: item.id,
            title: item.title,
            layout: item.layout,
            duration: item.duration,
            possibleToMove: modifiedStopCardList.length > 1,
          };
          return (
            <StopCardRow
              key={`stopcard-${index}`}
              noStopsSelected={noStops}
              cardInfo={cardInfo}
              feedIds={feedIds}
              orientation={orientation}
              cards={modifiedStopCardList}
              columns={item.columns}
              onCardDelete={item.onCardDelete}
              onCardMove={item.onCardMove}
              setStops={item.setStops}
              onStopDelete={item.onStopDelete}
              onStopMove={item.onStopMove}
              updateCardInfo={item.updateCardInfo}
              languages={languages}
            />
          );
        })}
      </ul>
      <div className="buttons">
        <div className="wide">
          <button className={cx('button', 'add-new-view')} onClick={addNew}>
            <span>{t('prepareDisplay')} </span>
          </button>
        </div>
        <button
          disabled={makeButtonsDisabled}
          className="button preview"
          onClick={openPreview}
          aria-label={ariaLabelForPreview}
        >
          <span>{t('previewView')}</span>
        </button>
        {!isModifyView && (
          <button
            disabled={makeButtonsDisabled}
            className="button create"
            onClick={() => createOrSaveMonitor(true)}
            aria-label={ariaLabelForCreate}
          >
            <span>{t('displayEditorStaticLink')}</span>
          </button>
        )}
        {isModifyView && (
          <>
            <button className="button" onClick={backToList}>
              <span>{t('cancel')}</span>
            </button>
            <button
              disabled={makeButtonsDisabled}
              className="button"
              onClick={() => createOrSaveMonitor(false)}
              aria-label={ariaLabelForSave}
            >
              <span>{t('save')}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default withTranslation('translations')(StopCardListContainer);
