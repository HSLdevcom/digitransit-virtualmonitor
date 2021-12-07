import React, { FC, useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';
import { IColumn, IStop } from '../util/Interfaces';
import Icon from './Icon';
import { GET_STOP, GET_STATION } from '../queries/stopStationQueries';
import { uniqBy, sortBy } from 'lodash';
import StopViewTitleEditor from './StopViewTitleEditor';
import DTAutosuggest from '@digitransit-component/digitransit-component-autosuggest';
import { setSearchContextWithFeedIds } from './searchContext';
import LayoutAndTimeContainer from './LayoutAndTimeContainer';
import StopListContainer from './StopListContainer';
import { ICardInfo } from './CardInfo';
import cx from 'classnames';
import {
  getAllIconStyleWithColor,
  getPrimaryColor,
  getModeSet,
} from '../util/getConfig';
import { isKeyboardSelectionEvent } from '../util/browser';

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
  readonly noStopsSelected: boolean;
  readonly feedIds: Array<string>;
  readonly cards: Array<any>;
  readonly cardInfo: ICardInfo;
  readonly columns: Array<IColumn>;
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

const StopCardRow: FC<IProps & WithTranslation> = ({
  orientation,
  feedIds,
  cards,
  cardInfo,
  columns,
  onCardDelete,
  onCardMove,
  onStopDelete,
  onStopMove,
  setStops,
  updateCardInfo,
  languages,
  noStopsSelected,
  t,
}) => {
  const [getStop, stopState] = useLazyQuery(GET_STOP, {
    fetchPolicy: 'network-only',
  });
  const [getStation, stationState] = useLazyQuery(GET_STATION, {
    fetchPolicy: 'network-only',
  });
  const [autosuggestValue, setAutosuggestValue] = useState(null);

  const onSelect = selected => {
    const properties = selected.properties;
    setAutosuggestValue(properties);
    switch (properties.layer) {
      case 'stop':
        getStop({
          variables: { ids: getGTFSId(properties.id) },
          context: { clientName: 'default' },
        });
        break;
      case 'station':
        getStation({
          variables: { ids: getGTFSId(properties.id) },
          context: { clientName: 'default' },
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
        cardInfo.id,
        'left',
        stopState.data.stop
          .filter(s => s && !columns['left'].stops.some(el => el.id === s.id))
          .map(stop => {
            const stopWithGTFS = {
              ...stop,
              locality: autosuggestValue.locality,
              modes: autosuggestValue.addendum.GTFS.modes,
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
              vehicleMode:
                stopWithGTFS.modes.length === 1
                  ? stopWithGTFS.modes[0]
                  : 'hybrid-'.concat(stopWithGTFS.modes.sort().join('-')),
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
        cardInfo.id,
        'left',
        stationState.data.station
          .filter(s => s && !columns['left'].stops.some(el => el.id === s.id))
          .map(station => {
            let patterns = [];

            station.stops.forEach(stop =>
              patterns.push(...stop.stoptimesForPatterns),
            );
            patterns = uniqBy(patterns, 'pattern.code');
            const stationWithGTFS = {
              ...station,
              locality: autosuggestValue.locality,
              modes: autosuggestValue.addendum.GTFS.modes,
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
              vehicleMode:
                stationWithGTFS.modes.length === 1
                  ? stationWithGTFS.modes[0]
                  : 'hybrid-'.concat(stationWithGTFS.modes.sort().join('-')),
            };
          }),
        false,
        undefined,
      );
    }
  }, [stationState.data]);

  const lang = t('languageCode');
  const isFirst = cardInfo.index === 0;
  const isLast = cardInfo.index === cards.length - 1;
  const isEastWest = cardInfo.layout >= 9 && cardInfo.layout <= 11;

  const filterSearchResults = results => {
    return results.filter(result => {
      const gtfsId = getGTFSId(result.properties.id);
      return !columns['left'].stops.some(s => s.gtfsId === gtfsId);
    });
  };
  return (
    <li className="stopcard" id={`stopcard_${cardInfo.id}`}>
      <div className="stopcard-row-container">
        <div className="title-with-icons">
          {languages.includes('fi') && (
            <StopViewTitleEditor
              id={cardInfo.id}
              layout={cardInfo.layout}
              title={cardInfo.title}
              updateCardInfo={updateCardInfo}
              lang={'fi'}
              index={cardInfo.index}
            />
          )}
          {languages.includes('sv') &&
            (!isEastWest || !languages.includes('fi')) && (
              <StopViewTitleEditor
                id={cardInfo.id}
                layout={cardInfo.layout}
                title={cardInfo.title}
                updateCardInfo={updateCardInfo}
                lang={'sv'}
                index={cardInfo.index}
              />
            )}
          {languages.includes('en') &&
            (!isEastWest ||
              (!languages.includes('fi') && !languages.includes('sv'))) && (
              <StopViewTitleEditor
                id={cardInfo.id}
                layout={cardInfo.layout}
                title={cardInfo.title}
                updateCardInfo={updateCardInfo}
                lang={'en'}
                index={cardInfo.index}
              />
            )}
          <div className="icons">
            {cards.length > 1 && (
              <div
                className={cx(
                  'delete icon',
                  cardInfo.possibleToMove ? '' : 'move-end',
                )}
                tabIndex={0}
                role="button"
                aria-label={t('deleteView', { id: `${cardInfo.index + 1}` })}
                onClick={() => onCardDelete(cardInfo.id)}
                onKeyPress={e =>
                  isKeyboardSelectionEvent(e, true) && onCardDelete(cardInfo.id)
                }
              >
                <Icon img="delete" color={getPrimaryColor()} />
              </div>
            )}
            {cardInfo.possibleToMove && (
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
                      id: `${cardInfo.index + 1}`,
                    })}
                    onClick={() =>
                      onCardMove(cardInfo.index, cardInfo.index + 1)
                    }
                    onKeyPress={e =>
                      isKeyboardSelectionEvent(e, true) &&
                      onCardMove(cardInfo.index, cardInfo.index + 1)
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
                      id: `${cardInfo.index + 1}`,
                    })}
                    onClick={() =>
                      onCardMove(cardInfo.index, cardInfo.index - 1)
                    }
                    onKeyPress={e =>
                      isKeyboardSelectionEvent(e, true) &&
                      onCardMove(cardInfo.index, cardInfo.index - 1)
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
                        id: `${cardInfo.index + 1}`,
                      })}
                      onClick={() =>
                        onCardMove(cardInfo.index, cardInfo.index - 1)
                      }
                      onKeyPress={e =>
                        isKeyboardSelectionEvent(e, true) &&
                        onCardMove(cardInfo.index, cardInfo.index - 1)
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
                        id: `${cardInfo.index + 1}`,
                      })}
                      onClick={() =>
                        onCardMove(cardInfo.index, cardInfo.index + 1)
                      }
                      onKeyPress={e =>
                        isKeyboardSelectionEvent(e, true) &&
                        onCardMove(cardInfo.index, cardInfo.index + 1)
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
              {noStopsSelected ? t('add-at-least-one-stop') : ''}
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
            cardInfo={cardInfo}
            updateCardInfo={updateCardInfo}
            durationEditable={cards.length !== 1 || languages.length > 1}
          />
        </div>
        <StopListContainer
          stops={columns}
          onStopDelete={onStopDelete}
          onStopMove={onStopMove}
          setStops={setStops}
          cardInfo={cardInfo}
          updateCardInfo={updateCardInfo}
          languages={languages}
        />
      </div>
    </li>
  );
};

export default withTranslation('translations')(StopCardRow);
