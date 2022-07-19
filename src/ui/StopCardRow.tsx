import React, { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';
import { ICardInfo, IStop } from '../util/Interfaces';
import Icon from './Icon';
import { GET_STOP, GET_STATION } from '../queries/stopStationQueries';
import { uniqBy, sortBy } from 'lodash';
import StopViewTitleEditor from './StopViewTitleEditor';
import DTAutosuggest from '@digitransit-component/digitransit-component-autosuggest';
import { setSearchContextWithFeedIds } from './searchContext';
import { getModeFromAddendum } from '../util/stopCardUtil';
import LayoutAndTimeContainer from './LayoutAndTimeContainer';
import StopListContainer from './StopListContainer';
import cx from 'classnames';
import {
  getAllIconStyleWithColor,
  getPrimaryColor,
  getModeSet,
} from '../util/getConfig';
import { isKeyboardSelectionEvent } from '../util/browser';
import { ConfigContext } from '../contexts';

const getGTFSId = id => {
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
    stops: Array<IStop>,
    reorder: boolean,
    gtfsIdForHidden: string,
  ) => void;
  readonly updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
    lang?: string,
  ) => void;
  languages: Array<string>;
}

const StopCardRow: FC<IProps> = ({
  orientation,
  cards,
  item,
  onCardDelete,
  onCardMove,
  onStopDelete,
  onStopMove,
  setStops,
  updateCardInfo,
  languages,
}) => {
  const { feedIds } = useContext(ConfigContext);
  const [t] = useTranslation();
  const [getStop, stopState] = useLazyQuery(GET_STOP, {
    fetchPolicy: 'network-only',
    context: { clientName: 'default' },
  });
  const [getStation, stationState] = useLazyQuery(GET_STATION, {
    fetchPolicy: 'network-only',
    context: { clientName: 'default' },
  });
  const [autosuggestValue, setAutosuggestValue] = useState(null);
  const { id, index, layout, columns } = item;
  const noStops =
    columns.left.stops.length === 0 && columns.right.stops.length === 0;
  const onSelect = selected => {
    const properties = selected.properties;
    setAutosuggestValue(properties);
    switch (properties.layer) {
      case 'stop':
        getStop({
          variables: { ids: getGTFSId(properties.id) },
        });
        break;
      case 'station':
        getStation({
          variables: { ids: getGTFSId(properties.id) },
        });
        break;
      default:
        break;
    }
  };

  const onClear = () => {
    return null;
  };

  useEffect(() => {
    if (stopState.data && stopState.data.stop) {
      setStops(
        id,
        'left',
        stopState.data.stop
          .filter(s => s && !columns.left.stops.some(el => el.id === s.id))
          .map(stop => {
            const stopWithGTFS = {
              ...stop,
              locality: autosuggestValue.locality,
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
        false,
        undefined,
      );
    }
  }, [stopState.data]);

  useEffect(() => {
    if (stationState.data && stationState.data.station) {
      setStops(
        id,
        'left',
        stationState.data.station
          .filter(s => s && !columns.left.stops.some(el => el.id === s.id))
          .map(station => {
            let patterns = [];
            station.stops.forEach(stop =>
              patterns.push(...stop.stoptimesForPatterns),
            );
            patterns = uniqBy(patterns, 'pattern.code');
            const stationWithGTFS = {
              ...station,
              locality: autosuggestValue.locality,
              mode: autosuggestValue.addendum?.GTFS.modes[0],
            };
            return {
              ...stationWithGTFS,
              code: station.stops[0].code, //t('station'),
              desc: station.stops[0].desc,
              patterns: sortBy(
                sortBy(patterns, 'pattern.route.shortname'),
                'pattern.route.shortname.length',
              ).map(e => e.pattern),
              hiddenRoutes: [],
            };
          }),
        false,
        undefined,
      );
    }
  }, [stationState.data]);

  const lang = t('languageCode');
  const isFirst = index === 0;
  const isLast = index === cards.length - 1;
  const isEastWest = layout >= 9 && layout <= 11;
  const possibleToMove = cards.length > 1;

  const filterSearchResults = results => {
    return results.filter(result => {
      const gtfsId = getGTFSId(result.properties.id);
      return !columns.left.stops.some(s => s.gtfsId === gtfsId);
    });
  };
  const style = {
    '--delayLength': `0.${1 + index}s`,
  } as React.CSSProperties;
  return (
    <li className="stopcard animate-in" id={`stopcard_${id}`} style={style}>
      <div className="stopcard-row-container">
        <div className="title-with-icons">
          {languages.map((lan, i) => {
            return (
              ((isEastWest && i === 0) || !isEastWest) && (
                <StopViewTitleEditor
                  card={item}
                  updateCardInfo={updateCardInfo}
                  lang={lan}
                />
              )
            );
          })}
          <div className="icons">
            {cards.length > 1 && (
              <div
                className={cx('delete icon', possibleToMove ? '' : 'move-end')}
                tabIndex={0}
                role="button"
                aria-label={t('deleteView', { id: `${index + 1}` })}
                onClick={() => onCardDelete(id)}
                onKeyPress={e =>
                  isKeyboardSelectionEvent(e, true) && onCardDelete(id)
                }
              >
                <Icon img="delete" color={getPrimaryColor()} />
              </div>
            )}
            {possibleToMove && (
              <div
                className={cx(
                  'move icon',
                  !isFirst && !isLast ? 'up-and-down' : '',
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
                      color={getPrimaryColor()}
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
                      color={getPrimaryColor()}
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
                        color={getPrimaryColor()}
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
                        color={getPrimaryColor()}
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
              searchContext={setSearchContextWithFeedIds(feedIds)}
              icon="search"
              id={'search'}
              placeholder={'autosuggestPlaceHolder'}
              value=""
              onSelect={onSelect}
              filterResults={filterSearchResults}
              onClear={onClear}
              autoFocus={false}
              lang={lang}
              sources={['Datasource']}
              targets={['Stops']}
              modeIconColors={getAllIconStyleWithColor()}
              modeSet={getModeSet()}
            />
          </div>
          <LayoutAndTimeContainer
            orientation={orientation}
            cardInfo={item}
            updateCardInfo={updateCardInfo}
            durationEditable={cards.length !== 1 || languages.length > 1}
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
