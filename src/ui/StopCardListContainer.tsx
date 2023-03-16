import cx from 'classnames';
import { IStop, IMonitor } from '../util/Interfaces';
import React, { FC, useContext, useEffect, useState } from 'react';
import StopCardRow from './StopCardRow';
import hash from 'object-hash';
import { useTranslation } from 'react-i18next';
import monitorAPI from '../api';
import { Link, Redirect } from 'react-router-dom';
import DisplaySettings from './DisplaySettings';
import { getLayout } from '../util/getResources';
import { defaultStopCard, getStopIcon } from '../util/stopCardUtil';
import Loading from './Loading';
import { defaultSettings } from './StopRoutesModal';
import UserViewTitleEditor from './UserViewTitleEditor';
import { DateTime } from 'luxon';
import { v5 as uuidv5 } from 'uuid';
import isEqual from 'lodash/isEqual';
import {
  getBoundingBox,
  namespace,
  stopsAndStationsFromViews,
  uuidValidateV5,
} from '../util/monitorUtils';
import PrepareMonitor from './PrepareMonitor';
import { UserContext } from '../contexts';
import { getParams } from '../util/queryUtils';
import { getConfig } from '../util/getConfig';
import { useMergeState } from '../util/utilityHooks';
import MapCardRow from './MapCardRow';
import MapModal from './MapModal';

interface IProps {
  stopCards: any;
  languages: Array<string>;
  loading?: boolean;
  vertical?: boolean;
  staticMonitor?: any;
  mapSettings?: any;
}

const StopCardListContainer: FC<IProps> = ({
  stopCards,
  loading = false,
  mapSettings,
  ...props
}) => {
  const user = useContext(UserContext);
  const [t] = useTranslation();
  const [stopCardList, setStopCardList] = useState(stopCards);
  const [languages, setLanguages] = useState(props.languages);
  const [mapProps, setMapProps] = useMergeState({
    center: mapSettings?.center,
    zoom: mapSettings?.zoom,
    bounds: mapSettings?.bounds,
    showMap: mapSettings?.showMap,
    hideTimeTable: mapSettings?.hideTimeTable,
    stops: mapSettings?.stops,
    userSet: mapSettings?.userSet,
  });
  const stopCoordinates = stopCardList.flatMap(card => {
    const stops = card.columns.left.stops.concat(card.columns.right.stops);
    return stops.map(s => [s.lat, s.lon]);
  });
  useEffect(() => {
    const stopsAndStations = stopsAndStationsFromViews(stopCardList);
    const stops = stopsAndStations
      .map(stops => {
        return stops.map(stop => {
          const coord: [number, number] = [stop?.lat, stop?.lon];
          const obj = {
            coords: coord,
            mode: getStopIcon(stop),
          };
          return obj;
        });
      })
      .flat();
    stops.forEach(c => {
      c.coords.flat();
    });
    setMapProps({
      stops: stops,
    });
  }, [stopCardList]);
  const handleShowMap = showMap => {
    if (showMap) {
      addMap();
    } else {
      setStopCardList(stopCardList.filter(s => s.type !== 'map'));
    }
    setMapProps({ showMap: showMap });
  };
  const updateMapSettings = settings => {
    setMapProps({ ...settings });
  };
  const bounds = getBoundingBox(stopCoordinates);
  useEffect(() => {
    if (mapProps.showMap) {
      // Check that the map is in the cardlist
      const map = stopCardList.find(i => i.type === 'map');
      if (!map) {
        addMap();
      }
    }
  });
  useEffect(() => {
    if (!mapProps.userSet && !isEqual(bounds, mapProps.bounds)) {
      setMapProps({
        bounds: bounds,
        center: null,
      });
    }
  });
  const isHorizontal =
    stopCardList[0].layout < 12 ||
    stopCardList[0].layout === 18 ||
    stopCardList[0].layout === 20;
  const [orientation, setOrientation] = useState(
    !isHorizontal ? 'vertical' : 'horizontal',
  );
  const [redirect, setRedirect] = useState(false);
  const [view, setView] = useState(undefined);
  const [isOpen, setOpen] = useState(false);
  const [isMapmodalOpen, setMapModalOpen] = useState(false);

  const [viewTitle, setViewTitle] = useState(
    props.staticMonitor ? props.staticMonitor.name : null,
  );

  const openMapModal = () => {
    setMapModalOpen(true);
  };
  const closeMapModal = () => {
    setMapModalOpen(false);
  };
  const openPreview = () => {
    setOpen(true);
  };
  const closePreview = () => {
    setOpen(false);
  };

  const onCardDelete = (id: number) => {
    const card = stopCardList.find(c => c.id === id);
    if (card?.type === 'map') {
      setMapProps({
        showMap: false,
      });
    }
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
    gtfsIdForHidden: string,
  ) => {
    const cardIndex = stopCardList.findIndex(card => card.id === cardId);
    if (!gtfsIdForHidden) {
      stopCardList[cardIndex].columns[side].stops =
        stopCardList[cardIndex].columns[side].stops.concat(stops);
      setStopCardList(stopCardList.slice());
    } else {
      const stopIndex = stopCardList[cardIndex].columns[side].stops.findIndex(
        stop => stop.gtfsId === gtfsIdForHidden,
      );
      stopCardList[cardIndex].columns[side].stops[stopIndex] = stops[0];
      setStopCardList(stopCardList.slice());
    }
  };

  const updateLayout = (cardId: number, value: number) => {
    const cardIndex = stopCardList.findIndex(card => card.id === cardId);
    if (
      getLayout(stopCardList[cardIndex].layout).isMultiDisplay &&
      !getLayout(+value).isMultiDisplay
    ) {
      stopCardList[cardIndex].columns.left.stops = stopCardList[
        cardIndex
      ].columns.left.stops.concat(
        stopCardList[cardIndex].columns.right.stops.filter(
          rs =>
            !stopCardList[cardIndex].columns.left.stops.find(
              s => s.gtfsId === rs.gtfsId,
            ),
        ),
      );
      stopCardList[cardIndex].columns.right.stops = [];
    }
    stopCardList[cardIndex].layout = value;
    setStopCardList(stopCardList.slice());
  };

  const updateCardInfo = (
    cardId: number,
    type: string,
    value: number | string,
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
    } else if (type === 'duration') {
      stopCardList[cardIndex].duration = value;
    }
    setStopCardList(stopCardList.slice());
  };
  const addMap = () => {
    let cnt = stopCardList.length + 1;
    while (cnt > 0) {
      if (stopCardList.filter(s => s.id === cnt).length === 0) {
        const newCard = {
          ...defaultStopCard(),
          id: cnt,
          layout: isHorizontal ? 2 : 12,
          type: 'map',
        };
        setStopCardList(stopCardList.concat(newCard));
        cnt = 0;
      }
      cnt--;
    }
  };
  const addNew = () => {
    let cnt = stopCardList.length + 1;
    while (cnt > 0) {
      if (stopCardList.filter(s => s.id === cnt).length === 0) {
        const newCard = {
          ...defaultStopCard(),
          id: cnt,
          layout: isHorizontal ? 2 : 12,
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
      updateLayout(card.id, orientation === 'horizontal' ? 2 : 14),
    );
  };

  const checkNoStops = stopCardList => {
    return stopCardList.some((stopCard, i) => {
      const ismap = stopCard.type === 'map';

      if (ismap) {
        return false;
      }
      const isMultiDisplay = getLayout(stopCard.layout).isMultiDisplay;
      return !isMultiDisplay
        ? stopCard.columns.left.stops.length === 0
        : stopCard.columns.left.stops.length === 0 ||
            stopCard.columns.right.stops.length === 0;
    });
  };

  const createOrSaveMonitor = isNew => {
    const languageArray = ['fi', 'sv', 'en'];
    const cardArray = stopCardList.slice();
    cardArray.forEach(card => {
      card.columns.left.stops = card.columns.left.stops.map(stop => {
        return {
          name: stop.name,
          gtfsId: stop.gtfsId,
          locationType: stop.locationType,
          settings: stop.settings,
          parentStation: stop.parentStation || null,
          mode: stop.mode ? stop.mode : stop.vehicleMode?.toLowerCase(),
          code: stop.code ? stop.code : null,
          locality: stop.locality,
          lat: stop.lat,
          lon: stop.lon,
        };
      });
      card.columns.right.stops = card.columns.right.stops.map(stop => {
        return {
          name: stop.name,
          gtfsId: stop.gtfsId,
          locationType: stop.locationType,
          settings: stop.settings ? stop.settings : defaultSettings,
          parentStation: stop.parentStation || null,
          mode: stop.mode ? stop.mode : stop.vehicleMode?.toLowerCase(),
          code: stop.code ? stop.code : null,
          locality: stop.locality,
          lat: stop.lat,
          lon: stop.lon,
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
      contenthash: '',
      mapSettings: mapProps,
    };
    newCard.contenthash = hash(newCard, {
      algorithm: 'md5',
      encoding: 'base64',
    }).replaceAll('/', '-');
    if (isNew) {
      if (user?.sub) {
        const newUuid = uuidv5(
          DateTime.now().toSeconds() + newCard.contenthash,
          namespace,
        );
        const newStaticMonitor = {
          ...newCard,
          name: viewTitle,
          url: newUuid,
          instance: getConfig().name,
        };
        monitorAPI.createStatic(newStaticMonitor).then((res: any) => {
          if (res.status === 200 || res.status === 409) {
            setView(newStaticMonitor);
            setRedirect(true);
          }
        });
      } else {
        monitorAPI.create(newCard).then((res: any) => {
          if (res.status === 200 || res.status === 409) {
            setView(newCard);
            setRedirect(true);
          }
        });
      }
    } else {
      if (user?.sub) {
        const newStaticMonitor = {
          ...newCard,
          name: viewTitle,
          id: props.staticMonitor.id,
          url: getParams(window.location.search).url,
          instance: getConfig().name,
        };
        monitorAPI.updateStatic(newStaticMonitor).then(res => {
          setView(newCard);
          setRedirect(true);
        });
      } else {
        monitorAPI.create(newCard).then(res => {
          setView(newCard);
          setRedirect(true);
        });
      }
    }
  };

  if (redirect && view) {
    let search;
    const isStatic = window.location.pathname === '/monitors/createview';
    const url = view.url ? view.url : getParams(window.location.search).url;
    if (isStatic && url && uuidValidateV5(url)) {
      search = `?url=${url}`;
    } else {
      search = `?cont=${view.contenthash}`;
    }
    return (
      <>
        {isStatic ? (
          <Redirect
            to={{
              pathname: '/monitors',
            }}
          />
        ) : (
          <Redirect
            to={{
              pathname: '/view',
              search: search,
              state: {
                view: view.cards,
                viewTitle: viewTitle,
              },
            }}
          />
        )}
      </>
    );
  }

  const createAriaLabel = (key, requirements, t) => {
    const joinedRequirements = requirements.join(` ${t('or')} `);
    return t(`notPossibleTo${key}`, { requirements: joinedRequirements });
  };

  const cards: IMonitor = {
    cards: stopCardList,
    languages: languages,
  };
  if (loading) {
    return <Loading white />;
  }

  const updateViewTitle = newTitle => {
    setViewTitle(newTitle);
  };

  const noStops = checkNoStops(stopCardList);
  const makeButtonsDisabled = !(languages.length > 0 && !noStops);
  const isModifyView = window.location.href.indexOf('url=') !== -1;
  const newDisplayDisabled = stopCardList.find(
    c => c.layout > 17 && c.layout < 20,
  );

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
    : t('save');
  const ariaNewDisplay = newDisplayDisabled
    ? t('new-display-disabled')
    : t('prepareDisplay');

  return (
    <div className="stop-card-list-container">
      <div className="animate-in">
        {user?.sub && window.location.pathname === '/monitors/createview' && (
          <UserViewTitleEditor
            title={viewTitle}
            updateViewTitle={updateViewTitle}
            monitorId={props.staticMonitor?.id}
          />
        )}
        <DisplaySettings
          orientation={orientation}
          handleOrientation={handleOrientation}
          languages={languages}
          handleChange={handleLanguageChange}
          showMap={mapProps.showMap}
          setShowMap={handleShowMap}
          disableToggle={mapProps.stops?.length === 0}
        />
      </div>
      {isOpen && (
        <PrepareMonitor
          preview={{
            isOpen: isOpen,
            view: cards,
            languages: languages,
            onClose: closePreview,
            isLandscape: orientation === 'horizontal' ? true : false,
            mapSettings: mapProps,
          }}
        />
      )}
      {isMapmodalOpen && (
        <MapModal
          isOpen={isMapmodalOpen}
          onClose={closeMapModal}
          mapSettings={mapProps}
          isLandscape={orientation == 'horizontal' ? true : false}
          updateMapSettings={updateMapSettings}
        />
      )}
      <ul className="stopcards">
        {stopCardList.map((item, index) => {
          const card: any = {
            index: index,
            ...item,
          };
          if (item.type === 'map') {
            return (
              <MapCardRow
                key={`stopcard-${index}`}
                item={card}
                cards={stopCardList}
                onCardDelete={onCardDelete}
                onCardMove={onCardMove}
                updateCardInfo={updateCardInfo}
                languages={languages}
                mapSettings={mapProps}
                updateMapSettings={updateMapSettings}
                openModal={openMapModal}
              />
            );
          }
          return (
            <StopCardRow
              key={`stopcard-${index}`}
              item={card}
              orientation={orientation}
              cards={stopCardList}
              onCardDelete={onCardDelete}
              onCardMove={onCardMove}
              setStops={setStops}
              onStopDelete={onStopDelete}
              onStopMove={onStopMove}
              updateLayout={updateLayout}
              updateCardInfo={updateCardInfo}
              languages={languages}
            />
          );
        })}
      </ul>
      <div className="buttons">
        <div className="wide">
          <button
            disabled={newDisplayDisabled}
            className={cx('button', 'add-new-view')}
            onClick={addNew}
            aria-label={ariaNewDisplay}
            title={newDisplayDisabled ? ariaNewDisplay : undefined}
          >
            <span>{t('prepareDisplay')} </span>
          </button>
        </div>
        <button
          disabled={makeButtonsDisabled}
          className="button"
          onClick={openPreview}
          title={makeButtonsDisabled ? ariaLabelForPreview : undefined}
          aria-label={ariaLabelForPreview}
        >
          <span>{t('previewView')}</span>
        </button>
        {!isModifyView && (
          <button
            disabled={makeButtonsDisabled}
            className="button blue"
            onClick={() => createOrSaveMonitor(true)}
            aria-label={ariaLabelForCreate}
            title={makeButtonsDisabled ? ariaLabelForCreate : undefined}
          >
            <span>{t('displayEditorStaticLink')}</span>
          </button>
        )}
        {isModifyView && (
          <>
            <Link className="button" to={'/monitors'}>
              <span>{t('cancel')}</span>
            </Link>
            <button
              disabled={makeButtonsDisabled}
              className="button blue"
              title={makeButtonsDisabled ? ariaLabelForSave : undefined}
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

export default StopCardListContainer;
