import React, { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';
import { ICardInfo, IStop } from '../util/Interfaces';
import Icon from './Icon';
import { StopQueryDocument, StationQueryDocument } from '../generated';
import { uniqBy, sortBy } from 'lodash';
import StopViewTitleEditor from './StopViewTitleEditor';
import DTAutosuggest from '@digitransit-component/digitransit-component-autosuggest';
import { getSearchContext } from './searchContext';
import { getModeFromAddendum } from '../util/stopCardUtil';
import LayoutAndTimeContainer from './LayoutAndTimeContainer';
import StopListContainer from './StopListContainer';
import cx from 'classnames';
import { isKeyboardSelectionEvent } from '../util/browser';
import { ConfigContext, FavouritesContext } from '../contexts';
import { IResult, PropertiesLayer } from '../types';

const getGTFSId = (id: string): string | undefined => {
  if (id && typeof id.indexOf === 'function' && id.indexOf('GTFS:') === 0) {
    if (id.indexOf('#') === -1) {
      return id.substring(5);
    }
    return id.substring(5, id.indexOf('#'));
  }
  return undefined;
};

interface IProps {
  readonly orientation: string;
  readonly cards: Array<any>;
  readonly item: ICardInfo;
  updateLayout: (cardId: number, layout: number) => void;
  readonly onCardDelete?: (id: number) => void;
  readonly onCardMove?: (oldIndex: number, newIndex: number) => void;
  readonly onStopDelete?: (
    cardId: number,
    side: string,
    gtfsId: string,
  ) => void;
  readonly onStopMove?: (cardId: number, side: string, gtfsId: string) => void;
  readonly setStops?: (
    cardId: number,
    side: string,
    stops: IStop[],
    gtfsIdForHidden: string,
  ) => void;
  readonly updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
    lang?: string,
  ) => void;
  languages: Array<string>;
  hideTitle?: boolean;
  hasMap?: boolean;
}

const StopCardRow: FC<IProps> = ({
  orientation,
  cards,
  item,
  onCardDelete,
  onCardMove,
  onStopDelete,
  updateLayout,
  onStopMove,
  setStops,
  updateCardInfo,
  languages,
  hideTitle,
  hasMap,
}) => {
  const config = useContext(ConfigContext);
  const favourites = useContext(FavouritesContext);
  const [t] = useTranslation();
  const lang: string = t('languageCode');
  const [selectedStopKey, setSelectedStopKey] = useState<number | null>(null);
  const [selectedStationKey, setSelectedStationKey] = useState<number | null>(
    null,
  );

  const [getStop, stopState] = useLazyQuery(StopQueryDocument, {
    fetchPolicy: 'network-only',
    context: { clientName: 'default' },
  });

  const [getStation, stationState] = useLazyQuery(StationQueryDocument, {
    fetchPolicy: 'network-only',
    context: { clientName: 'default' },
  });

  const [autosuggestValue, setAutosuggestValue] = useState(null);
  const { id, index, layout, columns } = item;
  const noStops: boolean =
    columns.left.stops.length === 0 && columns.right.stops.length === 0;

  const onSelect = async (selected: IResult): Promise<void> => {
    const properties = selected.properties;
    setAutosuggestValue(properties);
    switch (properties.layer) {
      case PropertiesLayer.STOP:
        await getStop({
          variables: { ids: getGTFSId(properties.id), language: lang },
        });
        setSelectedStopKey(Date.now());
        break;

      case PropertiesLayer.FAVORITE_STOP:
        await getStop({
          variables: { ids: properties.gtfsId, language: lang },
        });
        setSelectedStopKey(Date.now());
        break;

      case PropertiesLayer.STATION:
        await getStation({
          variables: { ids: getGTFSId(properties.id), language: lang },
        });
        setSelectedStationKey(Date.now());
        break;

      case PropertiesLayer.FAVORITE_STATION:
        await getStation({
          variables: { ids: properties.gtfsId, language: lang },
        });
        setSelectedStationKey(Date.now());
        break;

      default:
        break;
    }
  };

  const onClear = (): null => {
    return null;
  };

  const getLocality = () => {
    if (
      autosuggestValue.layer === 'favouriteStop' ||
      autosuggestValue.layer === 'favouriteStation'
    ) {
      const arr = autosuggestValue.address.split(',');
      return arr[arr.length - 1];
    }
    return autosuggestValue.locality;
  };

  useEffect((): void => {
    if (stopState.data && stopState.data.stop) {
      setStops(
        id,
        'left',
        stopState.data.stop
          .filter(
            (s: IStop) =>
              s && !columns.left.stops.some((el: IStop) => el.id === s.id),
          )
          .map(stop => {
            const stopWithGTFS = {
              ...stop,
              locality: getLocality(),
              mode: getModeFromAddendum(autosuggestValue.addendum?.GTFS.modes),
            };
            const routes = stop.stoptimesForPatterns.map(
              stoptimes => stoptimes.pattern,
            );
            return {
              ...stopWithGTFS,
              patterns: sortBy(
                sortBy(routes, 'route.shortName'),
                'shortName.length',
              ),
              hiddenRoutes: [],
              parentStation: stop.parentStation
                ? stop.parentStation.gtfsId
                : undefined,
            };
          }),
        undefined,
      );
    }
  }, [stopState.data, id, selectedStopKey]);

  useEffect((): void => {
    if (stationState.data && stationState.data.station) {
      setStops(
        id,
        'left',
        stationState.data.station
          .filter(
            (s: IStop) =>
              s && !columns.left.stops.some((el: IStop) => el.id === s.id),
          )
          .map(station => {
            let patterns = [];
            station.stops.forEach(stop =>
              patterns.push(...stop.stoptimesForPatterns),
            );
            patterns = uniqBy(patterns, 'pattern.code');
            const stationWithGTFS = {
              ...station,
              locality: getLocality(),
              mode: autosuggestValue.addendum?.GTFS.modes[0],
            };
            return {
              ...stationWithGTFS,
              desc: station.stops[0].desc,
              patterns: sortBy(
                sortBy(patterns, 'pattern.route.shortname'),
                'pattern.route.shortname.length',
              ).map(e => e.pattern),
              hiddenRoutes: [],
            };
          }),
        undefined,
      );
    }
  }, [stationState.data, id, selectedStationKey]);

  const isFirst: boolean = index === 0;
  const isLast: boolean = index === cards.length - 1;
  const isDouble: boolean = layout >= 9 && layout <= 11;
  const possibleToMove: boolean = cards.length > 1;
  const possibleToDelete: boolean = hasMap
    ? cards.length > 2
    : cards.length > 1;

  const filterSearchResults = (results: IResult[]): IResult[] => {
    if (config.stopSearchFilter) {
      return results
        .filter((result: IResult) => {
          const gtfsId: string = getGTFSId(result.properties.id);
          return !columns.left.stops.some((s: IStop) => s.gtfsId === gtfsId);
        })
        .filter(config.stopSearchFilter);
    }
    return results.filter((result: IResult) => {
      const gtfsId: string = getGTFSId(result.properties.id);
      return !columns.left.stops.some((s: IStop) => s.gtfsId === gtfsId);
    });
  };

  const style = {
    '--delayLength': `0.0s`,
  } as React.CSSProperties;

  const searchContext = {
    ...getSearchContext(config),
    getFavouriteStops: () =>
      // Result may also be something else than array, like an 500 http response
      Array.isArray(favourites)
        ? favourites.filter(f => f.type === 'stop' || f.type === 'station')
        : [],
  };

  return (
    <li className="stopcard animate-in" id={`stopcard_${id}`} style={style}>
      <div className="stopcard-row-container">
        <div className="title-with-icons">
          <div className="title-list">
            {!hideTitle &&
              languages.map((lan: string, i: number) => {
                return (
                  ((isDouble && i === 0) || !isDouble) && (
                    <StopViewTitleEditor
                      key={`lan-${lan}`}
                      card={item}
                      updateCardInfo={updateCardInfo}
                      lang={lan}
                    />
                  )
                );
              })}
          </div>
          <div className="icons">
            {possibleToDelete && (
              <div
                className={cx(
                  'delete icon',
                  possibleToMove ? 'move-end' : 'move-end',
                )}
                tabIndex={0}
                role="button"
                aria-label={t('deleteView', { id: `${index + 1}` })}
                onClick={() => onCardDelete(id)}
                onKeyPress={e =>
                  isKeyboardSelectionEvent(e, true) && onCardDelete(id)
                }
              >
                <Icon img="delete" color={config.colors.primary} />
              </div>
            )}
            {possibleToMove && (
              <div
                className={cx(
                  'move icon',
                  !isFirst && !isLast ? "up-and-down'" : '',
                )}
              >
                {isFirst && (
                  <div
                    tabIndex={0}
                    role="button"
                    aria-label={t('moveViewDown', {
                      id: `${index + 1}`,
                    })}
                    onClick={() => onCardMove(index, index + 1)}
                    onKeyPress={e =>
                      isKeyboardSelectionEvent(e, true) &&
                      onCardMove(index, index + 1)
                    }
                  >
                    <Icon
                      img="move-both-down"
                      color={config.colors.primary}
                      width={30}
                      height={40}
                    />
                  </div>
                )}
                {isLast && (
                  <div
                    tabIndex={0}
                    role="button"
                    aria-label={t('moveViewUp', {
                      id: `${index + 1}`,
                    })}
                    onClick={() => onCardMove(index, index - 1)}
                    onKeyPress={e =>
                      isKeyboardSelectionEvent(e, true) &&
                      onCardMove(index, index - 1)
                    }
                  >
                    <Icon
                      img="move-both-up"
                      color={config.colors.primary}
                      width={30}
                      height={40}
                    />
                  </div>
                )}
                {!isFirst && !isLast && (
                  <div className="container">
                    <div
                      tabIndex={0}
                      role="button"
                      aria-label={t('moveViewUp', {
                        id: `${index + 1}`,
                      })}
                      onClick={() => onCardMove(index, index - 1)}
                      onKeyPress={e =>
                        isKeyboardSelectionEvent(e, true) &&
                        onCardMove(index, index - 1)
                      }
                    >
                      <Icon
                        img="move-up"
                        color={config.colors.primary}
                        width={16}
                        height={16}
                      />
                    </div>
                    <div className="move-divider">
                      <div></div>
                    </div>
                    <div
                      tabIndex={0}
                      role="button"
                      aria-label={t('moveViewDown', {
                        id: `${index + 1}`,
                      })}
                      onClick={() => onCardMove(index, index + 1)}
                      onKeyPress={e =>
                        isKeyboardSelectionEvent(e, true) &&
                        onCardMove(index, index + 1)
                      }
                      className="move-down"
                    >
                      <Icon
                        img="move-down"
                        color={config.colors.primary}
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="headers">
          <div className="stop">{t('prepareStop')}</div>
          <div className="layout">{t('layout')}</div>
          <div className="duration">{t('duration')}</div>
        </div>
        <div className="search-stop-with-layout-and-time">
          <div className="search-stop">
            <div className="add-stop-alert" aria-hidden="true">
              {noStops ? t('add-at-least-one-stop') : ''}
            </div>
            <DTAutosuggest
              appElement={'root'}
              searchContext={searchContext}
              icon="search"
              id={'search'}
              placeholder={'autosuggestPlaceHolder'}
              value=""
              onSelect={onSelect}
              filterResults={filterSearchResults}
              onClear={onClear}
              autoFocus={false}
              lang={lang}
              sources={['Datasource', 'Favourite']}
              targets={['Stops']}
              modeIconColors={config.modeIcons.colors}
              modeSet={config.modeIcons.setName}
            />
          </div>
          <LayoutAndTimeContainer
            orientation={orientation}
            cardInfo={item}
            updateCardInfo={updateCardInfo}
            updateLayout={updateLayout}
            durationEditable={cards.length !== 1 || languages.length > 1}
            allowInformationDisplay={cards.length === 1}
          />
        </div>
        <StopListContainer
          onStopDelete={onStopDelete}
          onStopMove={onStopMove}
          setStops={setStops}
          card={item}
          updateCardInfo={updateCardInfo}
          languages={languages}
        />
      </div>
    </li>
  );
};

export default StopCardRow;
